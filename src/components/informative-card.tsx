import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface InformativeCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;

}

export function InformativeCard({title, description, icon, className}: InformativeCardProps) {
    return(
    <Card className={className}>
      <CardHeader>
        <div className="text-yellow-700 mb-2">{icon}</div>
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
    )
}