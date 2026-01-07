"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
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
   onSave: (event: { title: string; color: string; start: Date; end: Date; }) => void;
   date: Date | null;
}

const AddEventModal = ({ isOpen, onClose, onSave, date }: AddEventModalProps) => {
   const { register, handleSubmit, setValue, watch, reset, formState: { errors }, } = useForm<EventFormData>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
         title: "",
         color: "#000000",
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
            color: "#000000",
            startDate: startDate,
            endDate: startDate,
         });
      }
   }, [isOpen, date, reset]);

   if (!isOpen || !date) return null;

   const onSubmit = (data: EventFormData) => {
      onSave({
         title: data.title,
         color: data.color,
         start: new Date(data.startDate),
         end: new Date(data.endDate),
      });
      onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
         <div className="bg-stone-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Add Event</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               {/* TITLE */}
               <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                     Event Title
                  </label>
                  <input
                     {...register("title")}
                     type="text"
                     className={cn(
                        "w-full p-2 border rounded focus:outline-none focus:ring-2 bg-stone-700 text-white border-stone-600",
                        errors.title
                           ? "border-red-500 focus:ring-red-500"
                           : "focus:ring-white"
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
                     <label className="block text-sm font-medium mb-1 text-gray-200">
                        Start Date
                     </label>
                     <input
                        {...register("startDate")}
                        type="date"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-stone-700 text-white border-stone-600"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1 text-gray-200">End Date</label>
                     <input
                        {...register("endDate")}
                        type="date"
                        className={cn(
                           "w-full p-2 border rounded focus:outline-none focus:ring-2 bg-stone-700 text-white border-stone-600",
                           errors.endDate
                              ? "border-red-500 focus:ring-red-500"
                              : "focus:ring-white"
                        )}
                     />
                  </div>
               </div>
               {errors.endDate && (
                  <p className="text-red-500 text-xs">{errors.endDate.message}</p>
               )}

               {/* COLOR SECTION */}
               <div className="flex items-center gap-3">

                  {/* 1. COLOR PICKER: Not registered. Helper only. */}
                  <input
                     type="color"
                     value={selectedColor || "#000000"}
                     onChange={(e) => setValue("color", e.target.value, { shouldValidate: true })}
                     className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                  />

                  {/* 2. TEXT INPUT: Registered. Controlled by 'value' to sync. */}
                  <input
                     {...register("color")}
                     type="text"
                     // This keeps it in sync with the picker
                     value={selectedColor || "#000000"}
                     className="border rounded px-2 py-2 text-sm w-28 bg-stone-700 text-white border-stone-600 uppercase"
                     placeholder="#000000"
                  />
               </div>

               {/* ACTIONS */}
               <div className="flex justify-end gap-2 mt-6">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 text-gray-300 hover:bg-stone-700 rounded"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200"
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