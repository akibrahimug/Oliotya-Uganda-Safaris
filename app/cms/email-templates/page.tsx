"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { EmailTemplatePreview } from "@/components/cms/email-template-preview";
import { EmailTemplateEditModal } from "@/components/cms/email-template-edit-modal";
import { EmailTemplate } from "@/prisma/app/generated/prisma-client";

const templateTypes = [
  { type: 'booking_confirmation', label: 'Booking Confirmation (Customer)' },
  { type: 'booking_notification', label: 'Booking Notification (Admin)' },
  { type: 'contact_confirmation', label: 'Contact Confirmation (Customer)' },
  { type: 'contact_notification', label: 'Contact Notification (Admin)' },
  { type: 'custom_package_confirmation', label: 'Custom Package Confirmation (Customer)' },
  { type: 'custom_package_notification', label: 'Custom Package Notification (Admin)' },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cms/email-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditModalOpen(true);
  };

  const handleSave = async (data: Partial<EmailTemplate>) => {
    if (!editingTemplate) return;

    try {
      const response = await fetch(`/api/cms/email-templates/${editingTemplate.type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }

      toast({
        title: 'Success',
        description: 'Email template updated successfully',
      });

      await fetchTemplates();
      setEditModalOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save template',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Get label for template type
  const getTemplateLabel = (type: string) => {
    return templateTypes.find(t => t.type === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Email Templates</h1>
            <p className="text-sm text-muted-foreground">
              Preview and edit email templates. Click any template to customize.
            </p>
          </div>
        </div>
      </div>

      {/* Email Templates Preview */}
      <div className="bg-muted/30 p-4 rounded-lg space-y-8">
        {templateTypes.map((templateType) => {
          const template = templates.find(t => t.type === templateType.type);

          if (!template) {
            return (
              <div key={templateType.type} className="bg-background rounded-lg shadow-sm p-8">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-semibold mb-2">{templateType.label}</h3>
                  <p>Template not found in database</p>
                </div>
              </div>
            );
          }

          return (
            <div key={template.id} className="bg-background rounded-lg shadow-sm overflow-hidden">
              {/* Template Label */}
              <div className="bg-muted px-6 py-3 border-b">
                <h2 className="font-semibold text-lg">{templateType.label}</h2>
                <p className="text-sm text-muted-foreground">
                  Type: <code className="bg-background px-2 py-0.5 rounded">{template.type}</code>
                </p>
              </div>

              {/* Template Preview - Editable */}
              <EditableWrapper
                onEdit={() => handleEdit(template)}
                label={templateType.label}
              >
                <EmailTemplatePreview template={template} />
              </EditableWrapper>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingTemplate && (
        <EmailTemplateEditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingTemplate(null);
          }}
          onSave={handleSave}
          initialData={editingTemplate}
          templateLabel={getTemplateLabel(editingTemplate.type)}
        />
      )}
    </div>
  );
}
