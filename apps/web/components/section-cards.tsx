import { IconFileDescription, IconInbox, IconCircleCheck, IconFileCheck } from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface SectionCardsProps {
  stats?: {
    totalForms: number
    totalSubmissions: number
    totalPublished: number
    totalDrafts: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const totalForms = stats?.totalForms ?? 0
  const totalSubmissions = stats?.totalSubmissions ?? 0
  const totalPublished = stats?.totalPublished ?? 0
  const totalDrafts = stats?.totalDrafts ?? 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card relative overflow-hidden">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Total Forms</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl text-foreground">
            {totalForms}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <IconFileDescription className="size-4 text-primary" />
          <span>All forms created in your account</span>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Total Submissions</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl text-foreground">
            {totalSubmissions}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <IconInbox className="size-4 text-green-500" />
          <span>Form responses received from users</span>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Published Forms</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl text-foreground">
            {totalPublished}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <IconCircleCheck className="size-4 text-blue-500" />
          <span>Live forms accepting submissions</span>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Draft Forms</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl text-foreground">
            {totalDrafts}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <IconFileCheck className="size-4 text-amber-500" />
          <span>Unpublished drafts in progress</span>
        </CardFooter>
      </Card>
    </div>
  )
}
