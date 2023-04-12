-- CreateTable
CREATE TABLE "LikePostUser" (
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LikePostUser_userId_postId_key" ON "LikePostUser"("userId", "postId");

-- AddForeignKey
ALTER TABLE "LikePostUser" ADD CONSTRAINT "LikePostUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePostUser" ADD CONSTRAINT "LikePostUser_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
