import {Button} from '@mui/material'
import {Add} from '@mui/icons-material'

export default function AddButton({ text}) {
    return (
        <Button 
            variant="contained" 
            startIcon={<Add />}
            //component={InertiaLink} 
            href="#"
            //onClick={onClick}
          >
            {text}
          </Button>
    )
}