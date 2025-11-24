"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";

interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  respondedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export default function CMSInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    responded: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [searchTerm, statusFilter, inquiries]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/cms/contact");
      if (!response.ok) throw new Error("Failed to fetch inquiries");

      const data = await response.json();
      setInquiries(data.inquiries);

      // Calculate stats
      const newCount = data.inquiries.filter((i: ContactInquiry) => i.status === "NEW").length;
      const responded = data.inquiries.filter((i: ContactInquiry) => i.status === "RESPONDED").length;
      const resolved = data.inquiries.filter((i: ContactInquiry) => i.status === "RESOLVED").length;

      setStats({
        total: data.inquiries.length,
        new: newCount,
        responded,
        resolved,
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = inquiries;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.email.toLowerCase().includes(search) ||
          i.subject.toLowerCase().includes(search)
      );
    }

    setFilteredInquiries(filtered);
  };

  const handleViewDetails = async (inquiryId: number) => {
    try {
      const response = await fetch(`/api/cms/contact/${inquiryId}`);
      if (!response.ok) throw new Error("Failed to fetch inquiry details");

      const data = await response.json();
      setSelectedInquiry(data.inquiry);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching inquiry details:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiry details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/cms/contact/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update inquiry");

      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      });

      setDetailsOpen(false);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAdminNotes = async (adminNotes: string) => {
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/cms/contact/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });

      if (!response.ok) throw new Error("Failed to update admin notes");

      toast({
        title: "Success",
        description: "Admin notes saved successfully",
      });

      setSelectedInquiry({ ...selectedInquiry, adminNotes });
    } catch (error) {
      console.error("Error updating admin notes:", error);
      toast({
        title: "Error",
        description: "Failed to save admin notes",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (inquiryId: number) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/contact/${inquiryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete inquiry");

      toast({
        title: "Success",
        description: "Inquiry deleted successfully",
      });

      setDetailsOpen(false);
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      NEW: "outline",
      RESPONDED: "default",
      RESOLVED: "secondary",
    };

    const labels: Record<string, string> = {
      NEW: "New",
      RESPONDED: "Responded",
      RESOLVED: "Resolved",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
        <p className="text-muted-foreground">Manage customer inquiries and messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New</p>
              <p className="text-2xl font-bold">{stats.new}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responded</p>
              <p className="text-2xl font-bold">{stats.responded}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="RESPONDED">Responded</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inquiries Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className={inquiry.status === "NEW" ? "bg-yellow-50/50" : ""}>
                  <TableCell className="font-semibold">{inquiry.name}</TableCell>
                  <TableCell className="text-sm">{inquiry.email}</TableCell>
                  <TableCell className="text-sm">{inquiry.subject}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(inquiry.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(inquiry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Inquiry Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Inquiry Details</DialogTitle>
            <DialogDescription>
              Received on {selectedInquiry && new Date(selectedInquiry.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">
                      <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-semibold">
                        <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                          {selectedInquiry.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-semibold">{selectedInquiry.subject}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="font-semibold mb-3">Message</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={selectedInquiry.adminNotes || ""}
                  onChange={(e) =>
                    setSelectedInquiry({ ...selectedInquiry, adminNotes: e.target.value })
                  }
                  placeholder="Add internal notes about this inquiry..."
                  rows={3}
                />
                <Button
                  onClick={() => handleUpdateAdminNotes(selectedInquiry.adminNotes || "")}
                  disabled={updating}
                  className="mt-2"
                  size="sm"
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </div>

              {/* Status Update */}
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={handleUpdateStatus}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="RESPONDED">Responded</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <a href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </a>
                </Button>
                {selectedInquiry.phone && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <a href={`https://wa.me/${selectedInquiry.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
