
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui-custom/Button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Form schema with validations
const employeeFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  job_title: z.string().optional(),
  department: z.string().optional(),
  employment_type: z.string().optional(),
  employment_status: z.string().default("Active"),
  date_of_hire: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  home_address: z.string().optional(),
  postal_code: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  salary: z.number().optional(),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  cpf_contribution: z.boolean().default(false),
  cpf_account_number: z.string().optional(),
  tax_identification_number: z.string().optional(),
  leave_entitlement: z.number().optional(),
  medical_entitlement: z.number().optional(),
  employee_code: z.string().optional(),
  reporting_manager: z.string().optional(),
  probation_status: z.string().optional(),
  notes: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Intern"
];

const employmentStatuses = [
  "Active",
  "On Leave",
  "Resigned",
  "Terminated"
];

const departments = [
  "Management",
  "Human Resources",
  "Finance",
  "IT",
  "Operations",
  "Sales",
  "Marketing",
  "Customer Service",
  "Research & Development",
  "Legal"
];

const jobTitles = [
  "CEO",
  "CTO",
  "CFO",
  "HR Manager",
  "HR Executive",
  "Accountant",
  "Software Engineer",
  "Project Manager",
  "Operations Manager",
  "Sales Manager",
  "Marketing Specialist",
  "Customer Service Representative",
  "Research Analyst",
  "Legal Counsel",
  "Administrative Assistant"
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const nationalities = [
  "Singaporean",
  "Malaysian",
  "Indonesian",
  "Filipino",
  "Indian",
  "Chinese",
  "Australian",
  "British",
  "American",
  "Other"
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
    <Separator className="mt-6" />
  </div>
);

interface AddEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddEmployeeForm = ({ onSuccess, onCancel }: AddEmployeeFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employment_status: "Active",
      cpf_contribution: false,
    },
  });
  
  const onSubmit = async (data: EmployeeFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add an employee.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add the user_id to the data
      const employeeData = {
        ...data,
        user_id: user.id,
      };
      
      const { error } = await supabase.from("employees").insert(employeeData);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error adding employee:", error);
      
      toast({
        title: "Error",
        description: error.message || "An error occurred while adding the employee",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
        <Section title="Personal Information">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+65 9123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nationalities.map((nationality) => (
                      <SelectItem key={nationality} value={nationality}>
                        {nationality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>
        
        <Section title="Employment Details">
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="employment_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employmentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_of_hire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Hire</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="employee_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Code</FormLabel>
                <FormControl>
                  <Input placeholder="EMP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>
        
        <Section title="Contact & Address">
          <FormField
            control={form.control}
            name="home_address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emergency_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emergency_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+65 9876 5432" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>
        
        <Section title="Salary & Financial Information">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (SGD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5000" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="DBS Bank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bank_account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpf_contribution"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>CPF Contribution Eligible</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpf_account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="S1234567A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tax_identification_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Identification Number</FormLabel>
                <FormControl>
                  <Input placeholder="S9812345A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>
        
        <Section title="Leave & Benefits">
          <FormField
            control={form.control}
            name="leave_entitlement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Leave Entitlement (days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="14" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="medical_entitlement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Leave Entitlement (days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="14" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            Save Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};
