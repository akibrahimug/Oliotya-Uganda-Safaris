"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePicker } from "@/components/cms/image-picker";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
  specialties: string[];
  displayOrder: number;
  active: boolean;
}

interface AboutTeamModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialTeamMembers: TeamMember[];
}

export function AboutTeamModal({
  open,
  onClose,
  onRefresh,
  initialTeamMembers,
}: AboutTeamModalProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");

  useEffect(() => {
    if (initialTeamMembers) {
      setTeamMembers([...initialTeamMembers].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [initialTeamMembers]);

  const handleAdd = () => {
    setEditingId("new");
    setEditForm({
      name: "",
      role: "",
      bio: "",
      image: "",
      years: "",
      specialties: [],
      active: true,
    });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm(member);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setSpecialtyInput("");
  };

  const handleAddSpecialty = () => {
    if (!specialtyInput.trim()) return;

    setEditForm({
      ...editForm,
      specialties: [...(editForm.specialties || []), specialtyInput.trim()],
    });
    setSpecialtyInput("");
  };

  const handleRemoveSpecialty = (index: number) => {
    setEditForm({
      ...editForm,
      specialties: (editForm.specialties || []).filter((_, i) => i !== index),
    });
  };

  const handleSaveMember = async () => {
    if (!editForm.name || !editForm.role || !editForm.bio || !editForm.image || !editForm.years) {
      return;
    }

    setSaving(true);
    try {
      if (editingId === "new") {
        // Create new team member
        const response = await fetch("/api/cms/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            role: editForm.role,
            bio: editForm.bio,
            image: editForm.image,
            years: editForm.years,
            specialties: editForm.specialties || [],
            displayOrder: teamMembers.length,
            active: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create team member");
        }
      } else {
        // Update existing team member
        const response = await fetch("/api/cms/team", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: editForm.name,
            role: editForm.role,
            bio: editForm.bio,
            image: editForm.image,
            years: editForm.years,
            specialties: editForm.specialties,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update team member");
        }
      }

      onRefresh();
      setEditingId(null);
      setEditForm({});
      setSpecialtyInput("");
    } catch (error) {
      console.error("Error saving team member:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/cms/team?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      onRefresh();
    } catch (error) {
      console.error("Error deleting team member:", error);
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newMembers = [...teamMembers];
    [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];

    await updateOrders(newMembers);
  };

  const moveDown = async (index: number) => {
    if (index === teamMembers.length - 1) return;

    const newMembers = [...teamMembers];
    [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];

    await updateOrders(newMembers);
  };

  const updateOrders = async (newMembers: TeamMember[]) => {
    setSaving(true);
    try {
      for (let i = 0; i < newMembers.length; i++) {
        await fetch("/api/cms/team", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newMembers[i].id,
            displayOrder: i,
          }),
        });
      }

      onRefresh();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingId && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={editForm.role || ""}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          placeholder="Founder & CEO"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="years">Years of Experience</Label>
                      <Input
                        id="years"
                        value={editForm.years || ""}
                        onChange={(e) => setEditForm({ ...editForm, years: e.target.value })}
                        placeholder="15+ Years"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={editForm.bio || ""}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Brief bio about the team member..."
                      />
                    </div>

                    <div>
                      <Label>Photo</Label>
                      {editForm.image ? (
                        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden max-w-xs mt-2">
                          <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setImagePickerOpen(true)}
                            >
                              Change Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-32 mt-2"
                          onClick={() => setImagePickerOpen(true)}
                        >
                          Select Image
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Specialties</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={specialtyInput}
                          onChange={(e) => setSpecialtyInput(e.target.value)}
                          placeholder="Add specialty..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSpecialty();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSpecialty}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(editForm.specialties || []).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {specialty}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveMember} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Team Member"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveUp(index)}
                          disabled={index === 0 || saving}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveDown(index)}
                          disabled={index === teamMembers.length - 1 || saving}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <p className="text-xs text-muted-foreground mt-1">{member.years}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {member.specialties.map((specialty, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(member)}
                              disabled={editingId !== null}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(member.id)}
                              disabled={saving}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!editingId && (
              <Button variant="outline" className="w-full" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Team Member
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={onClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => {
          setEditForm({ ...editForm!, image: url });
          setImagePickerOpen(false);
        }}
      />
    </>
  );
}
