"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { AboutTeamModal } from "@/components/cms/about-team-modal";
import { TeamSectionModal } from "@/components/cms/team-section-modal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
  specialties: any[];
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamSection {
  id: string;
  heading: string;
  title: string;
  description: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamSection, setTeamSection] = useState<TeamSection | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // Fetch team data
  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/team?mode=cms");
      if (!response.ok) throw new Error("Failed to fetch team data");

      const data = await response.json();
      setTeamMembers(data.teamMembers || []);
      setTeamSection(data.teamSection);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // Handle team member actions
  const handleAddMember = () => {
    setSelectedMember(null);
    setTeamModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setTeamModalOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`/api/cms/team?id=${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member");

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      fetchTeamData();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and section content
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setSectionModalOpen(true)} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Section Settings
          </Button>
          <Button onClick={handleAddMember} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Section Preview */}
      {teamSection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-primary font-semibold">{teamSection.heading}</p>
              <h3 className="font-serif text-xl font-bold">{teamSection.title}</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {teamSection.description}
              </p>
              <Badge variant={teamSection.status === "PUBLISHED" ? "default" : "secondary"}>
                {teamSection.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Team Members</h3>
              <p className="text-muted-foreground mb-4">
                Add your first team member to get started
              </p>
              <Button onClick={handleAddMember} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-primary font-medium">{member.role}</p>
                        </div>
                      </div>
                      {!member.active && (
                        <Badge variant="secondary" className="text-xs">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {member.bio}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Order: {member.displayOrder}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AboutTeamModal
        open={teamModalOpen}
        onClose={() => {
          setTeamModalOpen(false);
          setSelectedMember(null);
        }}
        onRefresh={fetchTeamData}
        initialData={selectedMember}
      />

      <TeamSectionModal
        open={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onRefresh={fetchTeamData}
        initialData={teamSection}
      />
    </div>
  );
}
