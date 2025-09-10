// import request from 'supertest';
// import app from '../src/app'; 
// import { prisma } from '../src/database/prisma/seed';
// describe('AuthController', () => {
//   const testUser = {
//     email: 'test@example.com',
//     password: 'Test@1234',
//     firstname: 'Test',
//     lastname: 'User',
//     role: 'pme',
//   };
//   beforeAll(async () => {
//     // Supprime l’utilisateur s’il existe déjà
//     await prisma.user.deleteMany({ where: { email: testUser.email } });
//   });
//   afterAll(async () => {
//     // Nettoie les données et ferme Prisma
//     await prisma.user.deleteMany({ where: { email: testUser.email } });
//     await prisma.$disconnect();
//   });
//   describe('POST /api/auth/register', () => {
//     it('devrait enregistrer un nouvel utilisateur', async () => {
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send(testUser);
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('id');
//       expect(res.body.email).toBe(testUser.email);
//     });
//     it('devrait échouer si l’utilisateur existe déjà', async () => {
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send(testUser);
//       expect(res.statusCode).toBe(400); // ou 409 selon ta logique
//       expect(res.body).toHaveProperty('error');
//     });
//   });
//   describe('POST /api/auth/login', () => {
//     it('devrait connecter l’utilisateur avec succès', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: testUser.password,
//         });
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('token');
//     });
//     it('devrait échouer avec un mauvais mot de passe', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: 'wrongpass',
//         });
//       expect(res.statusCode).toBe(401);
//       expect(res.body).toHaveProperty('error');
//     });
//     it('devrait échouer si l’utilisateur n’existe pas', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: 'inexistant@example.com',
//           password: 'whatever',
//         });
//       expect(res.statusCode).toBe(404);
//       expect(res.body).toHaveProperty('error');
//     });
//   });
// });
