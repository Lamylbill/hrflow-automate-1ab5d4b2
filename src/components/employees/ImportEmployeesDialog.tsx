const importEmployeesToDatabase = async (employees: Partial<Employee>[]) => {
  try {
    if (employees.length === 0) {
      toast({
        title: "No Employees to Import",
        description: "No valid employees were found to import.",
        variant: "destructive",
      });
      setIsImporting(false);
      return;
    }

    console.log(`Importing ${employees.length} employees to database`);

    const safeUserId = user?.id?.trim();
    if (!safeUserId) throw new Error("Invalid user session. Please log in again.");

    for (const employee of employees) {
      const {
        allowances, familyMembers, education, workExperience, appraisalRatings, documents,
        created_at, updated_at, id,
        ...baseEmployee
      } = employee;

      const typedEmployee: Partial<Employee> = {
        ...baseEmployee,
        user_id: safeUserId,
        cpf_contribution: stringToBoolean(baseEmployee.cpf_contribution),
        disciplinary_flags: stringToBoolean(baseEmployee.disciplinary_flags),
        must_clock: stringToBoolean(baseEmployee.must_clock),
        all_work_day: stringToBoolean(baseEmployee.all_work_day),
        freeze_payment: stringToBoolean(baseEmployee.freeze_payment),
        paid_medical_examination_fee: stringToBoolean(baseEmployee.paid_medical_examination_fee),
        new_graduate: stringToBoolean(baseEmployee.new_graduate),
        rehire: stringToBoolean(baseEmployee.rehire),
        contract_signed: stringToBoolean(baseEmployee.contract_signed),
        thirteenth_month_entitlement: stringToBoolean(baseEmployee.thirteenth_month_entitlement),
      };

      const { error } = await supabase
        .from('employees')
        .insert(typedEmployee);

      if (error) throw error;
    }

    toast({
      title: "Import Successful",
      description: `Successfully imported ${employees.length} employees.`,
    });

    if (onImportSuccess) onImportSuccess();

    setFile(null);
    setPendingEmployees([]);
    setDuplicateCount(0);
    setNewEmployeesCount(0);
    setIsImporting(false);

  } catch (error: any) {
    console.error("Error importing employees to database:", error);
    toast({
      title: "Import Failed",
      description: error.message || "An error occurred while importing employees to the database.",
      variant: "destructive",
    });
    setIsImporting(false);
  }
};
