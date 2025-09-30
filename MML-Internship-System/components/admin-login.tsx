"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginProps {
	onLogin: (success: boolean) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Simple password check - in production, this should be more secure
		const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (password === adminPassword) {
			onLogin(true);
		} else {
			setError("Invalid password. Please try again.");
			onLogin(false);
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<Card className="w-full max-w-md border-border shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<Lock className="h-6 w-6 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl font-bold text-foreground">
						Admin Access
					</CardTitle>
					<CardDescription>
						Enter the admin password to access the dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-foreground"
							>
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter admin password"
									className="pr-10 border-input bg-background text-foreground"
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full bg-foreground text-background hover:bg-foreground/90"
							disabled={isLoading}
						>
							{isLoading ? "Verifying..." : "Access Dashboard"}
						</Button>
					</form>

					{/* <div className="mt-4 text-center">
						<p className="text-xs text-muted-foreground">
							For demo purposes, the password is:{" "}
							<code className="bg-muted px-1 rounded">admin123</code>
						</p>
					</div> */}
				</CardContent>
			</Card>
		</div>
	);
}
