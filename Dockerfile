FROM denoland/deno:latest

WORKDIR /app

COPY deno.json .

COPY . .

#EXPOSE 3000

CMD ["task", "start"]
