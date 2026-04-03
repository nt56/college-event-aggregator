"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchColleges } from "@/store/slices/collegesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import Image from "next/image";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
      message: "Please select a gender",
    }),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
      })
      .refine(
        (dob) => {
          const age = Math.floor(
            (Date.now() - new Date(dob).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000),
          );
          return age >= 16;
        },
        { message: "You must be at least 16 years old" },
      ),
    phone: z.string().optional(),
    collegeId: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must include uppercase, lowercase, and a number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const dispatch = useAppDispatch();
  const colleges = useAppSelector((s) => s.colleges.items);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedCollegeName, setSelectedCollegeName] = useState("");

  useEffect(() => {
    dispatch(fetchColleges({ limit: "100" }));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: undefined,
      dateOfBirth: "",
      phone: "",
      collegeId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /\d/.test(password || ""),
  };

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()),
  );

  const onSubmit = useCallback(
    async (data: SignUpValues) => {
      setIsSubmitting(true);
      try {
        const result = await registerUser({
          ...data,
          gender: data.gender || "prefer-not-to-say",
          dateOfBirth: data.dateOfBirth || "",
        });
        if (result.meta.requestStatus === "fulfilled") {
          setIsRedirecting(true);
          toast.success("Account created!", {
            description: "Welcome to CampusConnect. You are now signed in.",
          });
          router.push("/dashboard");
        } else {
          const errorMsg = (result.payload as string) || "Registration failed";
          toast.error("Registration failed", { description: errorMsg });
          setIsSubmitting(false);
        }
      } catch {
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
        setIsSubmitting(false);
      }
    },
    [registerUser, router],
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6f6f8] dark:bg-[#0f0a1e]">
      {/* Redirect overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              Account created! Setting things up...
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Taking you to your dashboard
            </p>
          </div>
        </div>
      )}
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in-up">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <Image
                src="/logo.jpg"
                alt="CollegeEventAggregator Logo"
                width={56}
                height={56}
                className="mx-auto mb-4 rounded-lg"
              />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Join CollegeEventAggregator Today
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Start discovering college events near you today.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    placeholder="John"
                    className="h-11 border-slate-300 dark:border-slate-700"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    placeholder="Doe"
                    className="h-11 border-slate-300 dark:border-slate-700"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="john@university.edu"
                  className="h-11 border-slate-300 dark:border-slate-700"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Gender
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(
                        "gender",
                        val as
                          | "male"
                          | "female"
                          | "other"
                          | "prefer-not-to-say",
                        { shouldValidate: true },
                      )
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-300 dark:border-slate-700">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other / Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Date of Birth
                  </Label>
                  <Input
                    type="date"
                    className="h-11 border-slate-300 dark:border-slate-700"
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-11 border-slate-300 dark:border-slate-700"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    College / University
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search institution..."
                      className="h-11 pl-10 border-slate-300 dark:border-slate-700"
                      value={selectedCollegeName || collegeSearch}
                      onChange={(e) => {
                        setCollegeSearch(e.target.value);
                        setSelectedCollegeName("");
                        if (!e.target.value) setValue("collegeId", "");
                      }}
                    />
                  </div>
                  {!selectedCollegeName &&
                    collegeSearch &&
                    filteredColleges.length > 0 && (
                      <div className="mt-1 max-h-40 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 relative">
                        {filteredColleges.map((college) => (
                          <button
                            key={college.id || college._id}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => {
                              setValue("collegeId", college.id || college._id);
                              setSelectedCollegeName(college.name);
                              setCollegeSearch("");
                            }}
                          >
                            {college.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`h-11 pr-10 ${
                        password &&
                        (!passwordChecks.uppercase ||
                          !passwordChecks.lowercase ||
                          !passwordChecks.number)
                          ? "border-red-400 dark:border-red-500"
                          : "border-slate-300 dark:border-slate-700"
                      }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-3 space-y-1">
                      <div
                        className={`flex items-center text-xs ${
                          passwordChecks.length
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordChecks.length ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordChecks.uppercase
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordChecks.uppercase ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        <span>At least one uppercase letter</span>
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordChecks.lowercase
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordChecks.lowercase ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        <span>At least one lowercase letter</span>
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordChecks.number
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordChecks.number ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        <span>At least one number</span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pr-10 border-slate-300 dark:border-slate-700"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isRedirecting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all mt-4"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Taking you to your dashboard...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  "Create Student Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/sign-in" className="block">
              <Button
                variant="outline"
                className="w-full h-12 font-semibold border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary transition-all"
              >
                Sign In Instead
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-400">
          <p>&copy; 2026 CampusConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
