"use client"

import Link from "next/link"
import { useGetDashboardStats } from "~/hooks/api/form"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { SectionCards } from "~/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { IconExternalLink, IconCalendar, IconUser } from "@tabler/icons-react"

export default function Page() {
  const { data: stats, isLoading } = useGetDashboardStats()

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading dashboard stats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Real Dynamic Stat Cards */}
        <SectionCards stats={stats} />
        
        {/* Sleek Dynamic Area Chart */}
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive stats={stats} />
        </div>
        
        {/* Real Recent Submissions Table */}
        <div className="px-4 lg:px-6">
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-bold">Recent Submissions</CardTitle>
                <CardDescription>
                  Your last 5 form submissions across all forms
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/forms">View All Forms</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-semibold text-foreground">Form Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Respondent Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Submitted At</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentSubmissions.map((sub: any) => (
                        <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                            {sub.formTitle}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                              <IconUser className="size-4 text-primary/70 shrink-0" />
                              <span className="truncate">{sub.respondentEmail || "Anonymous Respondent"}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <IconCalendar className="size-3.5 shrink-0" />
                              {new Date(sub.submittedAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 gap-1 hover:bg-primary/10 hover:text-primary transition-all duration-200" asChild>
                              <Link href={`/dashboard/forms/${sub.formId}/responses`}>
                                View Responses
                                <IconExternalLink className="size-3" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/10">
                  <p className="text-muted-foreground font-semibold mb-1">No submissions yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Publish your forms and share their public links to start collecting submissions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
