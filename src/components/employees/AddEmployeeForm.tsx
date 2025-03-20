
import React, { useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee, EmployeeFormValues } from '@/types/employee';

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
  </div>
);

interface AddEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  employeeData?: Employee | null;
}

export const AddEmployeeForm = ({ onSuccess, onCancel, employeeData }: AddEmployeeFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employment_status: "Active",
      cpf_contribution: false,
    },
  });
  
  useEffect(() => {
    if (employeeData) {
      // Safely type cast each field
      const formData = {
        full_name: employeeData.full_name || '',
        email: employeeData.email || '',
        job_title: employeeData.job_title || undefined,
        department: employeeData.department || undefined,
        employment_type: employeeData.employment_type || undefined,
        employment_status: employeeData.employment_status || "Active",
        date_of_hire: employeeData.date_of_hire || undefined,
        phone_number: employeeData.phone_number || undefined,
        date_of_birth: employeeData.date_of_birth || undefined,
        nationality: employeeData.nationality || undefined,
        gender: employeeData.gender || undefined,
        home_address: employeeData.home_address || undefined,
        postal_code: employeeData.postal_code || undefined,
        emergency_contact_name: employeeData.emergency_contact_name || undefined,
        emergency_contact_phone: employeeData.emergency_contact_phone || undefined,
        salary: typeof employeeData.salary === 'number' ? employeeData.salary : undefined,
        bank_name: employeeData.bank_name || undefined,
        bank_account_number: employeeData.bank_account_number || undefined,
        cpf_contribution: Boolean(employeeData.cpf_contribution),
        cpf_account_number: employeeData.cpf_account_number || undefined,
        tax_identification_number: employeeData.tax_identification_number || undefined,
        leave_entitlement: typeof employeeData.leave_entitlement === 'number' ? employeeData.leave_entitlement : undefined,
        medical_entitlement: typeof employeeData.medical_entitlement === 'number' ? employeeData.medical_entitlement : undefined,
        employee_code: employeeData.employee_code || undefined,
        reporting_manager: employeeData.reporting_manager || undefined,
        probation_status: employeeData.probation_status || undefined,
        notes: employeeData.notes || undefined,
      };
      
      form.reset(formData);
    }
  }, [employeeData, form]);
  
  const onSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add an employee.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const employeeData: EmployeeFormValues = {
        user_id: user.id,
        full_name: data.full_name,
        email: data.email,
        job_title: data.job_title || null,
        department: data.department || null,
        employment_type: data.employment_type || null,
        employment_status: data.employment_status || null,
        date_of_hire: data.date_of_hire || null,
        phone_number: data.phone_number || null,
        date_of_birth: data.date_of_birth || null,
        nationality: data.nationality || null,
        gender: data.gender || null,
        home_address: data.home_address || null,
        postal_code: data.postal_code || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        salary: data.salary || null,
        bank_name: data.bank_name || null,
        bank_account_number: data.bank_account_number || null,
        cpf_contribution: data.cpf_contribution || null,
        cpf_account_number: data.cpf_account_number || null,
        tax_identification_number: data.tax_identification_number || null,
        leave_entitlement: data.leave_entitlement || null,
        medical_entitlement: data.medical_entitlement || null,
        employee_code: data.employee_code || null,
        reporting_manager: data.reporting_manager || null,
        probation_status: data.probation_status || null,
        notes: data.notes || null,
      };
      
      let result;
      
      if (form.formState.defaultValues && "id" in form.formState.defaultValues) {
        const { data: updatedEmployee, error } = await supabase
          .from("employees")
          .update(employeeData)
          .eq("id", form.formState.defaultValues.id)
          .select();
          
        if (error) throw error;
        result = updatedEmployee;
        
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        const { data: newEmployee, error } = await supabase
          .from("employees")
          .insert(employeeData)
          .select();
          
        if (error) throw error;
        result = newEmployee;
        
        if (result && result.length > 0) {
          const { error: notificationError } = await supabase.from("notifications").insert({
            user_id: user.id,
            title: 'New Employee Added',
            message: `Employee ${data.full_name} has been added successfully.`,
            type: 'success',
            related_entity: 'employee',
            related_id: result[0].id
          });
          
          if (notificationError) {
            console.error("Error creating notification:", notificationError);
          }
        }
        
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      }
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving employee:", error);
      
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the employee",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="employment" className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="probation_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probation Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select probation status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="In Probation">In Probation</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Extended">Extended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <Section title="Contact & Address">
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
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Any additional notes" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            {employeeData ? 'Update Employee' : 'Save Employee'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
