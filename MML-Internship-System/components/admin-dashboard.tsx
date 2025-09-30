"use client";

import type { Role } from "@prisma/client";
import {
	Calendar,
	CheckCircle,
	Clock,
	ExternalLink,
	Eye,
	FileText,
	Filter,
	Loader2,
	Mail,
	Phone,
	Search,
	User,
	Users,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Application {
	id: string;
	legalName: string;
	email: string;
	contactNumber: string;
	resumeLink: string;
	justification: string;
	role: Role;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: string;
	updatedAt: string;
}

export function AdminDashboard() {
	const [applications, setApplications] = useState<Application[]>([]);
	const [filteredApplications, setFilteredApplications] = useState<
		Application[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
	const [selectedApplication, setSelectedApplication] =
		useState<Application | null>(null);

	useEffect(() => {
		fetchApplications();
	}, []);

	useEffect(() => {
		filterApplications();
	}, [applications, searchTerm, statusFilter, roleFilter]);

	const fetchApplications = async () => {
		try {
			const response = await fetch("/api/applications");
			if (!response.ok) {
				throw new Error("Failed to fetch applications");
			}
			const data = await response.json();
			setApplications(data);
		} catch (error) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const filterApplications = () => {
		let filtered = applications;

		if (searchTerm) {
			filtered = filtered.filter(
				(app) =>
					app.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					app.contactNumber.includes(searchTerm),
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((app) => app.status === statusFilter);
		}

		if (roleFilter !== "all") {
			filtered = filtered.filter((app) => app.role === roleFilter);
		}

		setFilteredApplications(filtered);
	};

	const updateApplicationStatus = async (
		id: string,
		status: "APPROVED" | "REJECTED",
	) => {
		setUpdatingStatus(id);
		try {
			const response = await fetch(`/api/applications/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error("Failed to update application status");
			}

			setApplications((prev) =>
				prev.map((app) =>
					app.id === id
						? { ...app, status, updatedAt: new Date().toISOString() }
						: app,
				),
			);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to update status",
			);
		} finally {
			setUpdatingStatus(null);
		}
	};

	const getRolep = (role: string) => {
		switch (role) {
			case "VIDEO_EDITOR":
				return "Video Editor";
			case "CONTENT_WRITER":
				return "Content Writer";
			case "WEB_DEVELOPER":
				return "Web Developer";
			case "GRAPHIC_DESIGNER":
				return "Graphic Designer";
			default:
				return role;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PENDING":
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-800 border-yellow-200"
					>
						Pending
					</Badge>
				);
			case "APPROVED":
				return (
					<Badge
						variant="secondary"
						className="bg-green-100 text-green-800 border-green-200"
					>
						Approved
					</Badge>
				);
			case "REJECTED":
				return (
					<Badge
						variant="secondary"
						className="bg-red-100 text-red-800 border-red-200"
					>
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const stats = {
		total: applications.length,
		pending: applications.filter((app) => app.status === "PENDING").length,
		approved: applications.filter((app) => app.status === "APPROVED").length,
		rejected: applications.filter((app) => app.status === "REJECTED").length,
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				<span className="ml-2 text-muted-foreground">
					Loading applications...
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Applications
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{stats.total}
						</div>
					</CardContent>
				</Card>

				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Pending
						</CardTitle>
						<Clock className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{stats.pending}
						</div>
					</CardContent>
				</Card>

				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Approved
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{stats.approved}
						</div>
					</CardContent>
				</Card>

				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Rejected
						</CardTitle>
						<XCircle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{stats.rejected}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by name, email, or contact number..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-input border-border"
					/>
				</div>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-48 bg-input border-border">
						<Filter className="h-4 w-4 mr-2" />
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="APPROVED">Approved</SelectItem>
						<SelectItem value="REJECTED">Rejected</SelectItem>
					</SelectContent>
				</Select>

				<Select value={roleFilter} onValueChange={setRoleFilter}>
					<SelectTrigger className="w-full sm:w-48 bg-input border-border">
						<SelectValue placeholder="Filter by role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="VIDEO_EDITOR">Video Editor</SelectItem>
						<SelectItem value="CONTENT_WRITER">Content Writer</SelectItem>
						<SelectItem value="WEB_DEVELOPER">Web Developer</SelectItem>
						<SelectItem value="GRAPHIC_DESIGNER">Graphic Designer</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Error Message */}
			{error && (
				<Alert className="border-destructive bg-destructive/10">
					<AlertDescription className="text-destructive">
						{error}
					</AlertDescription>
				</Alert>
			)}

			{/* Applications List */}
			<Card className="border-border">
				<CardHeader>
					<CardTitle className="text-xl font-bold text-foreground">
						Applications ({filteredApplications.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<ScrollArea className="h-[600px] w-full">
						<div className="space-y-1 p-4">
							{filteredApplications.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-muted-foreground">
										No applications found matching your criteria.
									</p>
								</div>
							) : (
								filteredApplications.map((application, index) => (
									<div key={application.id}>
										<div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group">
											<div className="flex items-center space-x-4 flex-1">
												<div className="flex-shrink-0">
													<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
														<User className="h-5 w-5 text-foreground" />
													</div>
												</div>

												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-3 mb-1">
														<h3 className="text-lg font-semibold text-foreground truncate">
															{application.legalName}
														</h3>
														{getStatusBadge(application.status)}
													</div>

													<div className="flex items-center gap-4 text-sm text-muted-foreground">
														<span className="flex items-center gap-1">
															<FileText className="h-3 w-3" />
															{getRolep(application.role)}
														</span>
														<span className="flex items-center gap-1">
															<Mail className="h-3 w-3" />
															{application.email}
														</span>
														<span className="flex items-center gap-1">
															<Phone className="h-3 w-3" />
															{application.contactNumber}
														</span>
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{new Date(
																application.createdAt,
															).toLocaleDateString()}
														</span>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="outline"
															size="sm"
															className="opacity-80 group-hover:opacity-100 transition-opacity bg-transparent"
															onClick={() =>
																setSelectedApplication(application)
															}
														>
															<Eye className="h-4 w-4 mr-1" />
															View Details
														</Button>
													</DialogTrigger>
													<DialogContent className="min-w-11/12 min-h-11/12 overflow-y-auto">
														<DialogHeader>
															<DialogTitle className="text-xl ">
																Application Details
															</DialogTitle>
														</DialogHeader>

														<div className="space-y-6 p-6">
															<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Legal Name
																	</p>
																	<p className="text-foreground font-medium text-lg">
																		{application.legalName}
																	</p>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Email Address
																	</p>
																	<p className="text-foreground text-lg">
																		{application.email}
																	</p>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Contact Number
																	</p>
																	<p className="text-foreground text-lg">
																		{application.contactNumber}
																	</p>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Role Applied For
																	</p>
																	<p className="text-foreground text-lg">
																		{getRolep(application.role)}
																	</p>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Application Status
																	</p>
																	<div>
																		{getStatusBadge(application.status)}
																	</div>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Applied Date
																	</p>
																	<p className="text-foreground text-lg">
																		{new Date(
																			application.createdAt,
																		).toLocaleDateString()}
																	</p>
																</div>

																<div className="space-y-2">
																	<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																		Resume
																	</p>
																	<a
																		href={application.resumeLink}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-foreground hover:underline flex items-center gap-1 text-lg"
																	>
																		View Resume{" "}
																		<ExternalLink className="h-4 w-4" />
																	</a>
																</div>
															</div>

															<Separator />

															<div className="space-y-4">
																<p className="p-0 m-0 text-sm font-medium text-muted-foreground">
																	Why they want to join & why we should hire
																	them
																</p>
																<div className="bg-muted/50 p-6 rounded-lg">
																	<p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
																		{application.justification}
																	</p>
																</div>
															</div>

															{application.status === "PENDING" && (
																<>
																	<Separator />
																	<div className="flex gap-4 pt-4">
																		<Button
																			onClick={() =>
																				updateApplicationStatus(
																					application.id,
																					"APPROVED",
																				)
																			}
																			disabled={
																				updatingStatus === application.id
																			}
																			className="bg-green-600 hover:bg-green-700 text-white flex-1 h-12 text-lg"
																		>
																			{updatingStatus === application.id ? (
																				<Loader2 className="h-5 w-5 animate-spin mr-2" />
																			) : (
																				<CheckCircle className="h-5 w-5 mr-2" />
																			)}
																			Approve Application
																		</Button>
																		<Button
																			variant="destructive"
																			onClick={() =>
																				updateApplicationStatus(
																					application.id,
																					"REJECTED",
																				)
																			}
																			disabled={
																				updatingStatus === application.id
																			}
																			className="flex-1 h-12 text-lg"
																		>
																			{updatingStatus === application.id ? (
																				<Loader2 className="h-5 w-5 animate-spin mr-2" />
																			) : (
																				<XCircle className="h-5 w-5 mr-2" />
																			)}
																			Reject Application
																		</Button>
																	</div>
																</>
															)}
														</div>
													</DialogContent>
												</Dialog>

												{application.status === "PENDING" && (
													<div className="flex gap-2">
														<Button
															size="sm"
															onClick={() =>
																updateApplicationStatus(
																	application.id,
																	"APPROVED",
																)
															}
															disabled={updatingStatus === application.id}
															className="bg-green-600 hover:bg-green-700 text-white"
														>
															{updatingStatus === application.id ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<CheckCircle className="h-4 w-4" />
															)}
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() =>
																updateApplicationStatus(
																	application.id,
																	"REJECTED",
																)
															}
															disabled={updatingStatus === application.id}
														>
															{updatingStatus === application.id ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<XCircle className="h-4 w-4" />
															)}
														</Button>
													</div>
												)}
											</div>
										</div>

										{index < filteredApplications.length - 1 && <Separator />}
									</div>
								))
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
