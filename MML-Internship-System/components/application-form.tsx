"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Textarea } from "@/components/ui/textarea";
import { type ApplicationFormData, applicationSchema } from "@/lib/validations";

export function ApplicationForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<ApplicationFormData>({
		resolver: zodResolver(applicationSchema),
	});

	const selectedRole = watch("role");

	const onSubmit = async (data: ApplicationFormData) => {
		setIsSubmitting(true);
		setSubmitStatus("idle");
		setErrorMessage("");

		try {
			const response = await fetch("/api/applications", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to submit application");
			}

			setSubmitStatus("success");
			reset();
		} catch (error) {
			setSubmitStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const roleOptions = [
		{ value: "VIDEO_EDITOR", label: "Video Editor" },
		{ value: "CONTENT_WRITER", label: "Content Writer" },
		{ value: "WEB_DEVELOPER", label: "Web Developer" },
		{ value: "GRAPHIC_DESIGNER", label: "Graphic Designer" },
	];

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Legal Name Field */}
			<div className="space-y-2">
				<Label
					htmlFor="legalName"
					className="text-sm font-medium text-foreground"
				>
					Legal Name *
				</Label>
				<Input
					id="legalName"
					type="text"
					placeholder="Enter your full legal name"
					className="bg-input border-border focus:ring-ring"
					{...register("legalName")}
				/>
				{errors.legalName && (
					<p className="text-sm text-red-600">{errors.legalName.message}</p>
				)}
			</div>

			{/* Email Address Field */}
			<div className="space-y-2">
				<Label htmlFor="email" className="text-sm font-medium text-foreground">
					Email Address *
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="your.email@example.com"
					className="bg-input border-border focus:ring-ring"
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-sm text-red-600">{errors.email.message}</p>
				)}
			</div>

			{/* Contact Number Field */}
			<div className="space-y-2">
				<Label
					htmlFor="contactNumber"
					className="text-sm font-medium text-foreground"
				>
					Contact Number *
				</Label>
				<Input
					id="contactNumber"
					type="tel"
					placeholder="+1 (555) 123-4567"
					className="bg-input border-border focus:ring-ring"
					{...register("contactNumber")}
				/>
				{errors.contactNumber && (
					<p className="text-sm text-red-600">{errors.contactNumber.message}</p>
				)}
			</div>

			{/* Resume Link Field */}
			<div className="space-y-2">
				<Label
					htmlFor="resumeLink"
					className="text-sm font-medium text-foreground"
				>
					Resume Link *
				</Label>
				<Input
					id="resumeLink"
					type="url"
					placeholder="https://drive.google.com/file/d/..."
					className="bg-input border-border focus:ring-ring"
					{...register("resumeLink")}
				/>
				<p className="text-xs text-muted-foreground">
					Please provide a link to your resume (Google Drive, Dropbox, etc.)
				</p>
				{errors.resumeLink && (
					<p className="text-sm text-red-600">{errors.resumeLink.message}</p>
				)}
			</div>

			{/* Role Selection */}
			<div className="space-y-2">
				<Label className="text-sm font-medium text-foreground">
					Internship Role *
				</Label>
				<Select
					value={selectedRole}
					onValueChange={(value) =>
						setValue("role", value as ApplicationFormData["role"])
					}
				>
					<SelectTrigger className="bg-input border-border focus:ring-ring">
						<SelectValue placeholder="Select the role you're applying for" />
					</SelectTrigger>
					<SelectContent>
						{roleOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.role && (
					<p className="text-sm text-red-600">{errors.role.message}</p>
				)}
			</div>

			{/* Justification Field */}
			<div className="space-y-2">
				<Label
					htmlFor="justification"
					className="text-sm font-medium text-foreground"
				>
					Why do you want to join MML-CONCEPT and why should we hire you? *
				</Label>
				<Textarea
					id="justification"
					placeholder="Tell us about your motivation, relevant skills, and what you can bring to our team. Be specific about why you're interested in this role and how you can contribute to MML-CONCEPT's success."
					className="bg-input border-border focus:ring-ring min-h-[120px] resize-y"
					{...register("justification")}
				/>
				<p className="text-xs text-muted-foreground">
					Minimum 50 characters. Share your passion, relevant experience, and
					what makes you a great fit.
				</p>
				{errors.justification && (
					<p className="text-sm text-red-600">{errors.justification.message}</p>
				)}
			</div>

			{/* Role Descriptions
			{selectedRole && (
				<div className="p-4 bg-muted rounded-lg border border-border">
					<h4 className="font-medium text-foreground mb-2">
						Role Description:
					</h4>
					<p className="text-sm text-muted-foreground">
						{selectedRole === "FRONTEND_DEVELOPER" &&
							"Work on user interfaces, responsive design, and client-side functionality using modern frameworks like React, Vue, or Angular."}
						{selectedRole === "BACKEND_DEVELOPER" &&
							"Develop server-side applications, APIs, and database systems using technologies like Node.js, Python, or Java."}
						{selectedRole === "CONTENT_WRITER" &&
							"Create engaging content for websites, blogs, social media, and marketing materials while maintaining brand voice and quality."}
					</p>
				</div>
			)} */}

			{/* Status Messages */}
			{submitStatus === "success" && (
				<Alert className="border-green-500 bg-green-50">
					<CheckCircle className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-800">
						Your application has been submitted successfully! We'll review it
						and get back to you soon.
					</AlertDescription>
				</Alert>
			)}

			{submitStatus === "error" && (
				<Alert className="border-red-500 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">
						{errorMessage}
					</AlertDescription>
				</Alert>
			)}

			{/* Submit Button */}
			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Submitting Application...
					</>
				) : (
					"Submit Application"
				)}
			</Button>

			<p className="text-xs text-muted-foreground text-center">
				By submitting this form, you agree to our terms and conditions and
				privacy policy.
			</p>
		</form>
	);
}
