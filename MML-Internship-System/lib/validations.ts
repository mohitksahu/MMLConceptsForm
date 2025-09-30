import { Role } from "@prisma/client";
import { z } from "zod";

export const applicationSchema = z.object({
	legalName: z
		.string()
		.min(2, "Legal name must be at least 2 characters")
		.max(100, "Legal name must be less than 100 characters")
		.regex(
			/^[a-zA-Z\s'-]+$/,
			"Legal name can only contain letters, spaces, hyphens, and apostrophes",
		),
	email: z
		.string()
		.email("Please enter a valid email address")
		.min(5, "Email must be at least 5 characters")
		.max(100, "Email must be less than 100 characters")
		.toLowerCase(),
	contactNumber: z
		.string()
		.regex(
			/^\+?[\d\s\-()]{10,}$/,
			"Please enter a valid contact number with at least 10 digits",
		)
		.transform((val) => val.replace(/\s/g, "")), // Remove spaces for storage
	resumeLink: z
		.string()
		.url("Please enter a valid URL for your resume")
		.refine((url) => {
			// Allow common file sharing services and direct file links
			const allowedDomains = [
				"drive.google.com",
				"dropbox.com",
				"onedrive.live.com",
				"github.com",
				"linkedin.com",
				"docdroid.net",
				"scribd.com",
			];
			const allowedExtensions = [".pdf", ".doc", ".docx"];

			try {
				const urlObj = new URL(url);
				const hostname = urlObj.hostname.toLowerCase();
				const pathname = urlObj.pathname.toLowerCase();

				// Check if it's from allowed domains
				const isAllowedDomain = allowedDomains.some((domain) =>
					hostname.includes(domain),
				);

				// Check if it's a direct file link with allowed extension
				const hasAllowedExtension = allowedExtensions.some((ext) =>
					pathname.endsWith(ext),
				);

				return isAllowedDomain || hasAllowedExtension;
			} catch {
				return false;
			}
		}, "Please provide a link from a supported platform (Google Drive, Dropbox, OneDrive, etc.) or a direct PDF/DOC link"),
	role: z.nativeEnum(Role, {
		required_error: "Please select a role",
		invalid_type_error: "Please select a valid role",
	}),
	justification: z
		.string()
		.min(
			50,
			"Please provide at least 50 characters explaining why you want to join",
		)
		.max(1000, "Justification must be less than 1000 characters")
		.refine((val) => val.trim().length > 0, "Justification cannot be empty"),
});

export const updateStatusSchema = z.object({
	status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
		required_error: "Status is required",
		invalid_type_error: "Invalid status value",
	}),
});

export const queryParamsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
	role: z.nativeEnum(Role).optional(),
	search: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type UpdateStatusData = z.infer<typeof updateStatusSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
