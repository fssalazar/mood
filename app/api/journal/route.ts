import { analyze } from '@/utils/ai'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day!',
    },
  })

  console.log(entry)

  const analysis = await analyze(entry.content)
  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      userId: user.id,
      ...analysis,
    },
  })
  console.log(entry)

  revalidatePath('/journal')

  return NextResponse.json({ data: entry })
}
