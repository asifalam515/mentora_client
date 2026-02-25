import TutorsContainer from "@/components/tutor/TutorsContainer";
import { tutorService } from "@/services/tutor.service";

const Tutors = async () => {
  const { data } = await tutorService.getTutors({
    isFeatured: false,
    search: "",
  });

  return (
    <div>
      <TutorsContainer></TutorsContainer>
    </div>
  );
};

export default Tutors;
