"use client";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/lib/api/categories";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  /* ================= FETCH ================= */
  const load = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = () => {
    if (!newName.trim()) return;

    startTransition(async () => {
      const temp: Category = { id: crypto.randomUUID(), name: newName };
      setCategories((p) => [...p, temp]); // optimistic

      try {
        const real = await createCategory(newName);
        setCategories((p) => p.map((c) => (c.id === temp.id ? real : c)));
        setNewName("");
        toast.success("Category created");
      } catch (e: any) {
        setCategories((p) => p.filter((c) => c.id !== temp.id));
        toast.error(e.message);
      }
    });
  };

  /* ================= UPDATE ================= */
  const handleUpdate = () => {
    if (!editing) return;

    startTransition(async () => {
      const prev = categories;

      setCategories((p) =>
        p.map((c) => (c.id === editing.id ? { ...c, name: editName } : c)),
      );

      try {
        await updateCategory(editing.id, editName);
        toast.success("Updated");
        setEditing(null);
      } catch (e: any) {
        setCategories(prev);
        toast.error(e.message);
      }
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (cat: Category) => {
    startTransition(async () => {
      const prev = categories;
      setCategories((p) => p.filter((c) => c.id !== cat.id));

      try {
        await deleteCategory(cat.id);
        toast.success("Deleted");
      } catch (e: any) {
        setCategories(prev);
        toast.error(e.message);
      }
    });
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ADD */}
        <div className="flex gap-2">
          <Input
            placeholder="New category"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : <Plus />}
            Add
          </Button>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id ?? Math.random()}>
                <TableCell className="font-medium">
                  {editing?.id === cat.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </TableCell>

                <TableCell className="text-right space-x-1">
                  {editing?.id === cat.id ? (
                    <Button size="sm" onClick={handleUpdate}>
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(cat);
                          setEditName(cat.name);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(cat)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
