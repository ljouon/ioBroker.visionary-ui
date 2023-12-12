import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Separator} from "@/components/ui/separator";

type FunctionCardProps = {
    id: string
    roomId: string
    title: string
    objects: string[]
}

export function FunctionCard({id, title, roomId, objects}: FunctionCardProps) {

    const icon = 'data:image/png;base64,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';
    return (
        <Card className="overflow-y-auto">
            <CardHeader>
                <div className="flex items-center justify-between space-x-2">
                    <div><CardTitle>{title}</CardTitle>
                        <CardDescription>Beschreibung</CardDescription>
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor={`${roomId}_all_${id}`} className="mr-2"><span
                            className="font-bold leading-snug text-muted-foreground">Alle</span></Label>
                        <Switch id={`${roomId}_all_${id}`} defaultChecked/>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Separator/>
                {objects.map(object =>
                    <div className="flex items-center w-full">

                        <div className="flex-none">
                            <img
                                className="dark:invert h-8 w-8 lg:w-10 lg:h-10 mr-2"
                                src={icon ?? undefined}
                                alt={'icon'}
                            />
                        </div>
                        <div className="flex-grow truncate mx-2">
                            <Label htmlFor={`${roomId}_${id}_${object}`}>
                                <CardTitle><span
                                    className="whitespace-nowrap overflow-hidden">{object}</span></CardTitle>
                                <CardDescription><span
                                    className="whitespace-nowrap overflow-hidden">Beschreibung</span></CardDescription>
                            </Label>
                        </div>
                        <div className="flex-none">
                            <Switch id={`${roomId}_${id}_${object}`} defaultChecked/>
                        </div>
                    </div>
                )}

            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>

    );
}