set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



 create table "public"."sounds" (
	"soundId" serial NOT NULL,
	"userId" int NOT NULL,
	"fileUrl" TEXT NOT NULL,
  "soundName" TEXT NOT NULL,
	"uploadedAt" TIMESTAMP NOT NULL,
	CONSTRAINT "sounds_pk" PRIMARY KEY ("soundId")
) WITH (
  OIDS=FALSE
);



create table "public"."bookmarks" (
	"userId" int NOT NULL,
	"soundId" int NOT NULL,
  "uploadedAt" TIMESTAMP NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sounds" ADD CONSTRAINT "sounds_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_fk1" FOREIGN KEY ("soundId") REFERENCES "sounds"("soundId");
