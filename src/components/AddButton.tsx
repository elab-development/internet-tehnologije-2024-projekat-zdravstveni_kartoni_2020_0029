import {Button} from '@mui/material'
import {Add} from '@mui/icons-material'

export default function AddButton({ text, link}) {
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