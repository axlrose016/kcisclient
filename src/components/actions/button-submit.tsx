import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ButtonSubmitProps {
    label: string;
    disabled?: boolean;
  }

  export function ButtonSubmit({ label, disabled = false }: ButtonSubmitProps) {
    return (
      <Button variant="default" type="submit" disabled={disabled} aria-busy={disabled} className="w-full">
        {disabled ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Please wait...</span>
          </>
        ) : (
          label
        )}
      </Button>
    );
  }