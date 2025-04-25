import { Trash2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  productName?: string;
  productId?: number;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  productName = "este producto",
  productId,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border border-gold/30 text-gold-light">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-gold">
            <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
            Confirmar eliminación
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gold-light/80">
          <div className="py-2 text-gold-light">
            ¿Estás seguro de que deseas eliminar <span className="font-semibold text-gold">{productName}</span>?
            {productId && <span className="block text-xs mt-1 opacity-70">(ID: {productId})</span>}
          </div>
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            Esta acción no se puede deshacer. Las imágenes asociadas también serán eliminadas.
          </div>
        </DialogDescription>
        <DialogFooter className="flex space-x-2 justify-end mt-4">
          <Button
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10 transition-all"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="bg-destructive hover:bg-destructive/80 transition-all flex items-center"
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 