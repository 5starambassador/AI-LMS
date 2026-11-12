-- CreateTable: timetable_periods
CREATE TABLE "timetable_periods" (
    "id"           TEXT         NOT NULL,
    "campusId"     TEXT         NOT NULL,
    "classId"      TEXT         NOT NULL,
    "sectionId"    TEXT,
    "dayOfWeek"    INTEGER      NOT NULL,
    "periodNumber" INTEGER      NOT NULL,
    "subject"      TEXT         NOT NULL,
    "teacherId"    TEXT,
    "startTime"    TEXT         NOT NULL,
    "endTime"      TEXT         NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timetable_periods_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "timetable_periods_classId_sectionId_dayOfWeek_periodNumber_key"
    ON "timetable_periods"("classId", "sectionId", "dayOfWeek", "periodNumber");

ALTER TABLE "timetable_periods"
    ADD CONSTRAINT "timetable_periods_campusId_fkey"  FOREIGN KEY ("campusId")  REFERENCES "campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "timetable_periods_classId_fkey"   FOREIGN KEY ("classId")   REFERENCES "classes"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "timetable_periods_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id")    ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: leave_requests
CREATE TABLE "leave_requests" (
    "id"         TEXT         NOT NULL,
    "userId"     TEXT         NOT NULL,
    "campusId"   TEXT         NOT NULL,
    "type"       TEXT         NOT NULL DEFAULT 'CASUAL',
    "reason"     TEXT         NOT NULL,
    "startDate"  TIMESTAMP(3) NOT NULL,
    "endDate"    TIMESTAMP(3) NOT NULL,
    "status"     TEXT         NOT NULL DEFAULT 'PENDING',
    "approverId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "remarks"    TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "leave_requests"
    ADD CONSTRAINT "leave_requests_userId_fkey"     FOREIGN KEY ("userId")     REFERENCES "users"("id")    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "leave_requests_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id")    ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "leave_requests_campusId_fkey"   FOREIGN KEY ("campusId")   REFERENCES "campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: fee_payments
CREATE TABLE "fee_payments" (
    "id"        TEXT         NOT NULL,
    "studentId" TEXT         NOT NULL,
    "campusId"  TEXT         NOT NULL,
    "feeType"   TEXT         NOT NULL,
    "amount"    DECIMAL      NOT NULL,
    "dueDate"   TIMESTAMP(3) NOT NULL,
    "paidAt"    TIMESTAMP(3),
    "status"    TEXT         NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "remarks"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "fee_payments"
    ADD CONSTRAINT "fee_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id")    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "fee_payments_campusId_fkey"  FOREIGN KEY ("campusId")  REFERENCES "campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
