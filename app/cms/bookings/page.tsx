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
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

interface Booking {
  id: number;
  confirmationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  bookingType: string;
  packageId: number | null;
  destinationId: number | null;
  numberOfTravelers: number;
  travelDateFrom: string;
  travelDateTo: string;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  specialRequests: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export default function CMSBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/cms/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data.bookings);

      // Calculate stats
      const pending = data.bookings.filter((b: Booking) => b.status === "PENDING").length;
      const confirmed = data.bookings.filter((b: Booking) => b.status === "CONFIRMED").length;
      const cancelled = data.bookings.filter((b: Booking) => b.status === "CANCELLED").length;
      const totalRevenue = data.bookings
        .filter((b: Booking) => b.status === "CONFIRMED")
        .reduce((sum: number, b: Booking) => sum + parseFloat(b.totalPrice), 0);

      setStats({
        total: data.bookings.length,
        pending,
        confirmed,
        cancelled,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.confirmationNumber.toLowerCase().includes(search) ||
          b.firstName.toLowerCase().includes(search) ||
          b.lastName.toLowerCase().includes(search) ||
          b.email.toLowerCase().includes(search)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/cms/bookings/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking details");

      const data = await response.json();
      setSelectedBooking(data.booking);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedBooking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/cms/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      setDetailsOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentStatus: string) => {
    if (!selectedBooking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/cms/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });

      setDetailsOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAdminNotes = async (adminNotes: string) => {
    if (!selectedBooking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/cms/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });

      if (!response.ok) throw new Error("Failed to update admin notes");

      toast({
        title: "Success",
        description: "Admin notes saved successfully",
      });

      setSelectedBooking({ ...selectedBooking, adminNotes });
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

  const handleDelete = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });

      setDetailsOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      CONFIRMED: "default",
      CANCELLED: "destructive",
      COMPLETED: "secondary",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      PAID: "default",
      FAILED: "destructive",
      REFUNDED: "secondary",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
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
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage all safari bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
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
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-full">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
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
              placeholder="Search by name, email, or confirmation number..."
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Confirmation #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Travel Dates</TableHead>
              <TableHead>Travelers</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-sm">
                    {booking.confirmationNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">
                        {booking.firstName} {booking.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.bookingType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(booking.travelDateFrom).toLocaleDateString()} -{" "}
                    {new Date(booking.travelDateTo).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.numberOfTravelers}</TableCell>
                  <TableCell className="font-semibold">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(booking.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(booking.id)}
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

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Confirmation #{selectedBooking?.confirmationNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-semibold">
                      {selectedBooking.firstName} {selectedBooking.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p className="font-semibold">{selectedBooking.country}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h3 className="font-semibold mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <Badge variant="outline">{selectedBooking.bookingType}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Number of Travelers</p>
                    <p className="font-semibold">{selectedBooking.numberOfTravelers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel From</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.travelDateFrom).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel To</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.travelDateTo).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Price</p>
                    <p className="font-semibold text-lg text-primary">
                      ${Number(selectedBooking.totalPrice).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Booking Date</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedBooking.paymentReference && (
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-semibold">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Reference</p>
                      <p className="font-semibold font-mono">{selectedBooking.paymentReference}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="font-semibold mb-3">Special Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={selectedBooking.adminNotes || ""}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, adminNotes: e.target.value })
                  }
                  placeholder="Add internal notes about this booking..."
                  rows={3}
                />
                <Button
                  onClick={() => handleUpdateAdminNotes(selectedBooking.adminNotes || "")}
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
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Booking Status</Label>
                  <Select
                    value={selectedBooking.status}
                    onValueChange={handleUpdateStatus}
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Payment Status</Label>
                  <Select
                    value={selectedBooking.paymentStatus}
                    onValueChange={handleUpdatePaymentStatus}
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
