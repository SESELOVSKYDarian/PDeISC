import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// siempre se pregunta antes de cerrar la sesión
export function LogoutDialog({ open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>Vas a salir de tu cuenta y tendrás que iniciar sesión otra vez para volver a entrar.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Cerrar sesión</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
