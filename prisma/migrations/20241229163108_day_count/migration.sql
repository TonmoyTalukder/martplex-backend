-- CreateTable
CREATE TABLE "daycount" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "daycount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daycount_id_key" ON "daycount"("id");
