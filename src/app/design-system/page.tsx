import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DesignSystemPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Design System v2</h1>
        <p className="text-muted-foreground text-lg">
          Showcase for the new design system implementing Poppins font, new color palette, and restricted shadows.
        </p>
      </div>

      <Separator />

      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Typography (Poppins)</h2>
        <div className="grid gap-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold">Heading 1 (Bold)</h1>
            <p className="text-sm text-muted-foreground">text-5xl font-bold</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold">Heading 2 (Semibold)</h2>
            <p className="text-sm text-muted-foreground">text-4xl font-semibold</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-medium">Heading 3 (Medium)</h3>
            <p className="text-sm text-muted-foreground">text-3xl font-medium</p>
          </div>
          <div className="space-y-1">
            <p className="text-base leading-7">
              Body text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-sm text-muted-foreground">text-base</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Muted text: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className="text-xs text-muted-foreground">text-sm text-muted-foreground</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Colors Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-primary shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#5473E8</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-secondary shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#2C2C2C</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-muted shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Gray</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-accent shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">Light Primary</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-destructive shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">Red</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-success shadow-sm" />
            <div className="space-y-1">
              <p className="font-medium">Success</p>
              <p className="text-xs text-muted-foreground">Green</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="lg">Large Button</Button>
          <Button>Default Button</Button>
          <Button size="sm">Small Button</Button>
          <Button size="icon" aria-label="Icon">
            <span className="h-4 w-4 bg-current rounded-full" />
          </Button>
        </div>
      </section>

      <Separator />

      {/* Cards Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cards (Radius & Shadows)</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card demonstrates the new border radius and shadow settings (shadow-sm max).</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>
          <Card className="bg-muted/50 border-none shadow-none">
             <CardHeader>
              <CardTitle>Flat Card</CardTitle>
              <CardDescription>A card without shadow/border for comparison.</CardDescription>
            </CardHeader>
             <CardContent>
               Some content.
             </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Form Elements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <div className="grid max-w-sm gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="email@example.com" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
        </div>
        <div className="grid max-w-sm gap-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Textarea)</Label>
            <Textarea id="bio" placeholder="Tell us about yourself" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role (Select)</Label>
            <Select>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </div>
      </section>
      
       <Separator />

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      {/* Avatars */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Avatars</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/google.png" alt="@google" />
            <AvatarFallback>GO</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Separator />

      {/* Tables */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Tables</h2>
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV003</TableCell>
                <TableCell>Unpaid</TableCell>
                <TableCell>Bank Transfer</TableCell>
                <TableCell className="text-right">$350.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
