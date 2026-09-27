-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "estadoCivil" INTEGER NOT NULL,
    "genero" INTEGER NOT NULL,
    "estadoAnimo" INTEGER NOT NULL,
    "Descripcion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userContactId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "descripcion" TEXT,
    "type" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatParticipants" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "multimediaUrl" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estados" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Views" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "taken" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallParticipants" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "idCall" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userContactId_fkey" FOREIGN KEY ("userContactId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipants" ADD CONSTRAINT "ChatParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipants" ADD CONSTRAINT "ChatParticipants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estados" ADD CONSTRAINT "Estados_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallParticipants" ADD CONSTRAINT "CallParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallParticipants" ADD CONSTRAINT "CallParticipants_idCall_fkey" FOREIGN KEY ("idCall") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
