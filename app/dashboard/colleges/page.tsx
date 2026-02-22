"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "@/store/slices/collegesSlice";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { TableRowSkeleton } from "@/components/common/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Building2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CollegeManagementPage() {
  const dispatch = useAppDispatch();
  const { items: colleges, isLoading } = useAppSelector((s) => s.colleges);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchColleges({ limit: "100" }));
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormLocation("");
    setFormOpen(true);
  };

  const openEdit = (college: {
    id?: string;
    _id?: string;
    name: string;
    location?: string;
  }) => {
    setEditingId(college.id || college._id || null);
    setFormName(college.name);
    setFormLocation(college.location || "");
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error("College name is required");
      return;
    }
    setSubmitting(true);
    try {
      const data = { name: formName.trim(), location: formLocation.trim() || undefined };
      if (editingId) {
        await dispatch(updateCollege({ id: editingId, data })).unwrap();
        toast.success("College updated");
      } else {
        await dispatch(createCollege(data)).unwrap();
        toast.success("College created");
      }
      dispatch(fetchColleges({ limit: "100" }));
      setFormOpen(false);
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteCollege(deleteTarget)).unwrap();
      toast.success("College deleted");
    } catch {
      toast.error("Failed to delete college");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredColleges = colleges.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">College Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage colleges and institutions on the platform.
          </p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" />
          Add College
        </Button>
      </header>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <TableRowSkeleton cols={4} />
            <TableRowSkeleton cols={4} />
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Building2}
              title="No colleges found"
              description={
                search
                  ? "Try a different search term."
                  : "Add the first college to get started."
              }
              actionLabel={!search ? "Add College" : undefined}
              onAction={!search ? openCreate : undefined}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredColleges.map((college) => {
                  const cid = college.id || college._id;
                  return (
                    <tr
                      key={cid}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="font-semibold">{college.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {college.location || "-"}
                      </td>
                      <td className="px-6 py-5">
                        {college.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-sm">
                            <XCircle className="h-4 w-4" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {college.createdAt
                          ? format(new Date(college.createdAt), "MMM dd, yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            className="text-slate-400 hover:text-primary transition-colors"
                            onClick={() => openEdit(college)}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => setDeleteTarget(cid!)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit College" : "Add New College"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                College Name *
              </label>
              <Input
                placeholder="e.g. MIT Engineering"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Location
              </label>
              <Input
                placeholder="e.g. Cambridge, MA"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete College"
        description="This will permanently delete the college. Events and users linked to it may be affected."
        confirmLabel="Delete College"
        onConfirm={handleDelete}
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
