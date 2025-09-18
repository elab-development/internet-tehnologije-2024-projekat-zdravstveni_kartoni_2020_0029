import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

type Props = {
  text: string;
  onClick: () => void;
};

export default function AddButton({ text, onClick }: Props) {
  return (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
