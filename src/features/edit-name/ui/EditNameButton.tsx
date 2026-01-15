"use client";
import { useFavoritesStore } from "@/entities/favorite/lib/store";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Field, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EditNameButton({ id }: { id: string }) {
  const { getNickname, updateNickname } = useFavoritesStore();
  const currentNickname = getNickname(id);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nickname = formData.get("nickname") as string;
    updateNickname(id, nickname);
    toast.success("별명이 변경되었습니다.");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="ml-2" render={<SquarePen />} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>장소 별명 지정</DialogTitle>
          <DialogDescription>
            장소의 별명을 지정해보세요. <br />
            즐겨찾기 목록에서 지정한 별명이 표시됩니다.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-name-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Input id="nickname" name="nickname" defaultValue={currentNickname ?? ""} />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">취소</Button>} />
          <Button type="submit" form="edit-name-form">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
