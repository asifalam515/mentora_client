import BecomeTutorForm from "@/components/tutor/BecomeTutorForm";
import { categoriesService } from "@/services/modules/category/category.service";

const page = async () => {
  const { data: categories } = await categoriesService.getCategories();
  return (
    <div>
      <h1>Become a Tutor</h1>
      <BecomeTutorForm categories={categories.data}></BecomeTutorForm>
    </div>
  );
};

export default page;
