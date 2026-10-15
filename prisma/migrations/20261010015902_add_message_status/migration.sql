-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('SEND', 'RECIBE', 'VIEW');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT 'SEND',
ALTER COLUMN "content" DROP NOT NULL;
