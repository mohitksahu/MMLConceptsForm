"use client";

import { useEffect } from "react";
import { ApplicationForm } from "@/components/application-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
    useEffect(() => {
        fetch("https://your-backend-service-url.com/api/data")
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
                        MML-CONCEPT Internship Application
                    </h1>
                    <p className="text-lg text-muted-foreground text-pretty">
                        Join our team as an intern and kickstart your career in technology
                        and content creation.
                    </p>
                </div>

                <Card className="border-border shadow-sm">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl text-card-foreground">
                            Apply for Internship
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Please fill out all required fields to submit your application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApplicationForm />
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Questions? Contact us at{" "}
                        <a
                            href="mailto:mmlconcept04@gmail.com"
                            className="text-primary hover:underline"
                        >
                            mmlconcept04@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
