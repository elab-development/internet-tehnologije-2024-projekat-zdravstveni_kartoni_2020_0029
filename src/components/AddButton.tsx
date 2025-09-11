import {Button} from '@mui/material'
import {Add} from '@mui/icons-material'

type Props = {
  text: string;
  link: string;
};


export default function AddButton({text, link}: Props) {
    return (
        <Button 
            variant="contained" 
            startIcon={<Add />}
            //component={InertiaLink} 
            href={link}
            //onClick={onClick}
          >
            {text}
          </Button>
    )
}