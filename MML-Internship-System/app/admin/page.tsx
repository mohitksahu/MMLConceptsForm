"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Check if user is already authenticated (from localStorage)
	useEffect(() => {
		const authStatus = localStorage.getItem("admin-authenticated");
		if (authStatus === "true") {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, []);

	const handleLogin = (success: boolean) => {
		if (success) {
			setIsAuthenticated(true);
			localStorage.setItem("admin-authenticated", "true");
		}
	};

	// const handleLogout = () => {
	// 	setIsAuthenticated(false);
	// 	localStorage.removeItem("admin-authenticated");
	// };

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	// Show login if not authenticated
	if (!isAuthenticated) {
		return <AdminLogin onLogin={handleLogin} />;
	}

	return (
		<div className="min-h-screen bg-background py-8 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Admin Dashboard
					</h1>
					<p className="text-muted-foreground">
						Manage and review internship applications for MML-CONCEPT.
					</p>
				</div>

				<Card className="border-border shadow-sm">
					<CardHeader>
						<CardTitle className="text-xl text-card-foreground">
							Internship Applications
						</CardTitle>
						<CardDescription>
							Review, approve, or reject applications from potential interns.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AdminDashboard />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
