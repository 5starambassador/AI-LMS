-- CreateTable
CREATE TABLE "parent_tokens" (
    "id"           TEXT NOT NULL,
    "token"        TEXT NOT NULL,
    "studentId"    TEXT NOT NULL,
    "generatedBy"  TEXT NOT NULL,
    "campusId"     TEXT NOT NULL,
    "usedAt"       TIMESTAMP(3),
    "expiresAt"    TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parent_tokens_token_key" ON "parent_tokens"("token");

-- AddForeignKey
ALTER TABLE "parent_tokens" ADD CONSTRAINT "parent_tokens_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_tokens" ADD CONSTRAINT "parent_tokens_generatedBy_fkey"
    FOREIGN KEY ("generatedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_tokens" ADD CONSTRAINT "parent_tokens_campusId_fkey"
    FOREIGN KEY ("campusId") REFERENCES "campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
