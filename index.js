var buffer = new Buffer(4);

process.stdout.write('\x1b[31m');
buffer.writeUInt8(0xe2, 0);
buffer.writeUInt8(0x95, 1);
buffer.writeUInt8(0xbf, 2);
process.stdout.write(buffer);
buffer.writeUInt8(0xf0, 0);
buffer.writeUInt8(0x9f, 1);
buffer.writeUInt8(0x8d, 2);
buffer.writeUInt8(0xba, 3);
buffer.writeUInt8(0xf0, 0);
process.stdout.write(buffer);
process.stdout.write('\x1b[0m');

