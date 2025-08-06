import { useState } from 'react';
import { Button, Checkbox, Input, Password } from 'rizzui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Flex } from '../common/Flex';
import { useDrawer } from '../../store/drawer.store';
import { FixedDrawerBottom } from '../common/FixedDrawerBottom';
import axios from 'axios';
import { toast } from 'sonner';

const EditAdminForm = ({
  admin,
  fetchData,
}: {
  admin: any;
  fetchData: () => void;
}) => {
  const { closeDrawer } = useDrawer();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isChangedPassword, setChangedPassword] = useState<boolean>(false);

  const validateSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalide email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  });

  const handleUpdate = async () => {
    const errors = await formik.validateForm();
    if (
      Object.keys(errors).length === 0 ||
      (!isChangedPassword && errors.password && errors.confirmPassword)
    ) {
      try {
        setLoading(true);
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/update_admin/${admin.id}`,
          {
            name: formik.values.name,
            email: formik.values.email,
            ...(isChangedPassword && { password: formik.values.password }),
          },
        );
        if (res.status === 200) {
          closeDrawer();
          fetchData();
          toast.success(res.data.msg);
        }
      } catch (err: any) {
        toast.error(err.response.msg);
      } finally {
        setLoading(false);
      }
    } else {
      Object.keys(formik.values).forEach((field) =>
        formik.setFieldTouched(field, true),
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      name: admin?.name as string,
      email: admin?.email as string,
      password: '',
      confirmPassword: '',
    },
    validationSchema: validateSchema,
    onSubmit: handleUpdate,
  });

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <div className="flex flex-col items-stretch gap-5">
        <Input
          label="Name"
          name="name"
          placeholder="John Doe"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : undefined
          }
          className="dark:[&_.rizzui-input-container]:border-stroke dark:[&_.rizzui-input-container]:ring-0"
          errorClassName="text-red-500 text-xs ml-1"
          inputClassName={`${
            formik.touched.name && formik.errors.name
              ? 'border-red-400 [&.is-hover]:border-red-400 [&.is-focus]:ring-red-500 [&.is-focus]:border-red-400'
              : ''
          }`}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="example@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
          className="dark:[&_.rizzui-input-container]:border-gray-700 dark:[&_.rizzui-input-container]:ring-0"
          errorClassName="text-red-500 text-xs ml-1"
          inputClassName={`${
            formik.touched.email && formik.errors.email
              ? 'border-red-400 [&.is-hover]:border-red-400 [&.is-focus]:ring-red-500 [&.is-focus]:border-red-400'
              : ''
          }`}
        />

        <Checkbox
          label="Change your password?"
          checked={isChangedPassword}
          onChange={() => {
            if (!isChangedPassword) {
              setChangedPassword(!isChangedPassword);
            }
            setChangedPassword(!isChangedPassword);
          }}
          inputClassName="w-5 h-5"
          iconClassName="text-white w-4 h-4 mt-3 ml-0.5 mt-0.5"
        />

        <Password
          disabled={!isChangedPassword}
          label="Password"
          name="password"
          placeholder="**********"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            isChangedPassword &&
            formik.touched.password &&
            formik.errors.password
              ? formik.errors.password
              : undefined
          }
          className="dark:[&_.rizzui-password-container]:border-gray-700 dark:[&_.rizzui-password-container]:ring-0"
          errorClassName="text-red-500 text-xs ml-1"
          inputClassName={`${
            isChangedPassword &&
            formik.touched.password &&
            formik.errors.password
              ? 'border-red-400 [&.is-hover]:border-red-400 [&.is-focus]:ring-red-500 [&.is-focus]:border-red-400'
              : ''
          }`}
        />

        <Password
          disabled={!isChangedPassword}
          label="Confirm your password"
          name="confirmPassword"
          placeholder="**********"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            isChangedPassword &&
            formik.touched.confirmPassword &&
            formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
          className="dark:[&_.rizzui-password-container]:border-gray-700 dark:[&_.rizzui-password-container]:ring-0"
          errorClassName="text-red-500 text-xs ml-1"
          inputClassName={`${
            isChangedPassword &&
            formik.touched.confirmPassword &&
            formik.errors.confirmPassword
              ? 'border-red-400 [&.is-hover]:border-red-400 [&.is-focus]:ring-red-500 [&.is-focus]:border-red-400'
              : ''
          }`}
        />

        <FixedDrawerBottom>
          <Button
            type="submit"
            size="lg"
            variant="outline"
            className="border-stroke dark:border-strokedark hover:text-black"
            onClick={closeDrawer}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full disabled:bg-[#F8F9FB] text-white bg-primary hover:opacity-90"
            isLoading={isLoading}
            onClick={handleUpdate}
          >
            Save
          </Button>
        </FixedDrawerBottom>
      </div>
    </Flex>
  );
};

export default EditAdminForm;
