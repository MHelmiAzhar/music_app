import amqp from 'amqplib';

const getRabbitMqServer = () => {
  const server = process.env.RABBITMQ_SERVER;
  if (!server) {
    throw new Error('RABBITMQ_SERVER is not set');
  }
  return server;
};

export const publishMessage = async (queue, message) => {
  const server = getRabbitMqServer();
  const connection = await amqp.connect(server);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  const payload = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queue, payload, { persistent: true });

  await channel.close();
  await connection.close();
};
