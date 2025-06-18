'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Loader2, Send } from 'lucide-react'
import { motion } from 'framer-motion'

const leadFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters.'
  }),
  company: z.string().min(2, {
    message: 'Company must be at least 2 characters.'
  }),
  linkedinUrl: z
    .string()
    .url({
      message: 'Please enter a valid LinkedIn URL.'
    })
    .optional()
    .or(z.literal(''))
})

type LeadFormValues = z.infer<typeof leadFormSchema>

interface LeadFormProps {
  onSubmit: (values: LeadFormValues) => void
  loading?: boolean
}

export const LeadForm = (props: LeadFormProps) => {

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      linkedinUrl: ''
    }
  })
  return (
    <motion.div
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
      className="space-y-6 mt-20 w-full max-w-3xl"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(props.onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>{'The lead\'s full name'}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Marketing Lead" {...field} />
                  </FormControl>
                  <FormDescription>Their job title or position</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Corp" {...field} />
                  </FormControl>
                  <FormDescription>The company they work for</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/johndoe"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to their LinkedIn profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={props.loading} className="w-full">
            {props.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Message
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}
