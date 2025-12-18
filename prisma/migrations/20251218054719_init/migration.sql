-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preference_id" TEXT,

    CONSTRAINT "PreferLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferMuscle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preference_id" TEXT,

    CONSTRAINT "PreferMuscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preference_id" TEXT,

    CONSTRAINT "PreferEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,

    CONSTRAINT "WorkoutPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutDay" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "workout_plan_id" TEXT NOT NULL,

    CONSTRAINT "WorkoutDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "workout_day_id" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "detail_id" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_user_id_key" ON "Preference"("user_id");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferLevel" ADD CONSTRAINT "PreferLevel_preference_id_fkey" FOREIGN KEY ("preference_id") REFERENCES "Preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferMuscle" ADD CONSTRAINT "PreferMuscle_preference_id_fkey" FOREIGN KEY ("preference_id") REFERENCES "Preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferEquipment" ADD CONSTRAINT "PreferEquipment_preference_id_fkey" FOREIGN KEY ("preference_id") REFERENCES "Preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutDay" ADD CONSTRAINT "WorkoutDay_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "WorkoutDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
