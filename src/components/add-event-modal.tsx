"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
// FIX 1: Clean import
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@lib/utils";

const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    color: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {title: string;  color: "#ffffff";  start: Date;  end: Date; }) => void;
  date: Date | null;
}

const AddEventModal = ({ isOpen, onClose, onSave, date }: AddEventModalProps) => {
  const { register, handleSubmit, setValue,  watch,  reset, formState: { errors },} = useForm<EventFormData>({
            resolver: zodResolver(eventSchema),
            defaultValues: {
              title: "",
              color: "default", // default is technically "blue" in your logic usually, but "default" works if mapped
              startDate: "",
              endDate: "",
            },
          });

  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen && date) {
      const startDate = format(date, "yyyy-MM-dd");
      reset({
        title: "",
        color: "white", // Set a safe default color
        startDate: startDate,
        endDate: startDate,
      });
    }
  }, [isOpen, date, reset]);

  if (!isOpen || !date) return null;

  const onSubmit = (data: EventFormData) => {
    onSave({
      title: data.title,
      // @ts-ignore - straightforward casting for the color string
      color: data.color,
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Event</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title
            </label>
            <input
              {...register("title")}
              type="text"
              className={cn(
                "w-full p-2 border rounded focus:outline-none focus:ring-2",
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              )}
              placeholder="Event Name"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DATES ROW */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                {...register("startDate")}
                type="date"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                {...register("endDate")}
                type="date"
                className={cn(
                  "w-full p-2 border rounded focus:outline-none focus:ring-2",
                  errors.endDate
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-black"
                )}
              />
            </div>
          </div>
          {errors.endDate && (
            <p className="text-red-500 text-xs">{errors.endDate.message}</p>
          )}

          {/* COLOR */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register("color")}
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <input
              {...register("color")}
              className="border rounded px-2 py-1 text-sm w-28"
              placeholder="#FFFFFF"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
