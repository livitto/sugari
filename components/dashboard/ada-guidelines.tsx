import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function ADAGuidelines() {
  return (
    <Card className="border-blue-200">
      <CardHeader className="px-4 py-4">
        <CardTitle className="flex gap-2 text-base items-start">
          
          ADA Blood Glucose Guidelines
        </CardTitle>
        <CardDescription className="text-xs">American Diabetes Association target ranges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-800 text-sm">Target Range (Fasting)</p>
              <p className="text-xs text-green-700">Before meals</p>
            </div>
            <p className="text-lg font-bold text-green-800 ml-2">80-130 mg/dL</p>
          </div>

          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-800 text-sm">Target Range (After Meals)</p>
              <p className="text-xs text-green-700">1-2 hours after eating</p>
            </div>
            <p className="text-lg font-bold text-green-800 ml-2">&lt; 180 mg/dL</p>
          </div>

          <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800 text-sm">Low Blood Sugar</p>
              <p className="text-xs text-red-700">Hypoglycemia - Requires immediate action</p>
            </div>
            <p className="text-lg font-bold text-red-800 ml-2">&lt; 70 mg/dL</p>
          </div>

          <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800 text-sm">High Blood Sugar</p>
              <p className="text-xs text-red-700">Hyperglycemia - Contact healthcare provider</p>
            </div>
            <p className="text-lg font-bold text-red-800 ml-2">&gt; 180 mg/dL</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p className="font-semibold mb-1">Important Notes:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li>These are general guidelines. Your target range may differ based on your individual treatment plan.</li>
            <li>Always consult with your healthcare provider for personalized advice.</li>
            <li>Regular monitoring helps you understand patterns and make informed decisions.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
