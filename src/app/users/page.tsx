"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Formik, Form, Field } from "formik";
import Joi from "joi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Label,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/";
import { signOut } from "next-auth/react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const roles = [
  { id: 1, name: "Admin", value: "Admin" },
  { id: 2, name: "User", value: "User" },
];

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
  role: Joi.string().required().messages({
    "string.empty": "Role is required",
    "any.required": "Role is required",
  }),
});

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (userData: Omit<User, "id">) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const newUser = await res.json();
        // console.log(newUser);
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateWithJoi = (values: Omit<User, "id">) => {
    const { error } = userSchema.validate(values, { abortEarly: false });

    if (!error) return {};

    return error.details.reduce((acc, current) => {
      const key = current.path[0] as keyof Omit<User, "id">;
      acc[key] = current.message;
      return acc;
    }, {} as Record<keyof Omit<User, "id">, string>);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Users Management</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          type="submit"
          className="bg-red-500 cursor-pointer hover:bg-red-500/70"
        >
          Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted">
              <p className="text-lg">No users found</p>
              <p className="mt-2 text-muted-foreground">
                Create your first user using the form
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ name: "", email: "", role: "" }}
                validate={validateWithJoi}
                onSubmit={(values, { resetForm }) => {
                  handleCreateUser(values);
                  resetForm();
                }}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        placeholder="Enter user name"
                        className={
                          errors.name && touched.name
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        placeholder="Enter user email"
                        className={
                          errors.email && touched.email
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={values.role}
                        onValueChange={(value) => setFieldValue("role", value)}
                      >
                        <SelectTrigger
                          id="role"
                          className={`w-full ${
                            errors.role && touched.role
                              ? "border-destructive"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.value}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && touched.role && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Create User
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
