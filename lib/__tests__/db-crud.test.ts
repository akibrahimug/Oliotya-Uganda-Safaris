import { prisma } from '../db';
import { Prisma } from '../../prisma/app/generated/prisma-client';

describe('Database CRUD Operations', () => {
  // Clean up test data after all tests
  afterAll(async () => {
    // Clean up in reverse order of dependencies
    await prisma.userFavorite.deleteMany({
      where: { user: { email: { contains: 'test-' } } },
    });
    await prisma.booking.deleteMany({
      where: { email: { contains: 'test-' } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: 'test-' } },
    });
    await prisma.destination.deleteMany({
      where: { name: { contains: 'Test Destination' } },
    });
    await prisma.contactInquiry.deleteMany({
      where: { email: { contains: 'test-' } },
    });
    await prisma.newsletterSubscription.deleteMany({
      where: { email: { contains: 'test-' } },
    });
    await prisma.$disconnect();
  });

  describe('User Model', () => {
    it('should create a user', async () => {
      const user = await prisma.user.create({
        data: {
          id: 'test-user-1',
          email: 'test-user1@example.com',
          firstName: 'Test',
          lastName: 'User',
          phone: '+256700000000',
        },
      });

      expect(user).toBeDefined();
      expect(user.id).toBe('test-user-1');
      expect(user.email).toBe('test-user1@example.com');
      expect(user.firstName).toBe('Test');
      expect(user.lastName).toBe('User');
    });

    it('should read a user', async () => {
      const user = await prisma.user.findUnique({
        where: { id: 'test-user-1' },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe('test-user1@example.com');
    });

    it('should update a user', async () => {
      const user = await prisma.user.update({
        where: { id: 'test-user-1' },
        data: { phone: '+256700000001' },
      });

      expect(user.phone).toBe('+256700000001');
    });

    it('should list users', async () => {
      const users = await prisma.user.findMany({
        where: { email: { contains: 'test-' } },
      });

      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('Destination Model', () => {
    let destinationId: number;

    it('should create a destination', async () => {
      const destination = await prisma.destination.create({
        data: {
          name: 'Test Destination Safari',
          category: 'Wildlife Safari',
          country: 'Uganda',
          price: new Prisma.Decimal('1200.00'),
          rating: 5,
          duration: '3 Days',
          groupSize: 6,
          minTravelers: 2,
          maxTravelers: 8,
          description: 'Test safari description',
          image: '/test-image.jpg',
        },
      });

      destinationId = destination.id;
      expect(destination).toBeDefined();
      expect(destination.name).toBe('Test Destination Safari');
      expect(destination.price.toString()).toBe('1200');
    });

    it('should read a destination', async () => {
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });

      expect(destination).toBeDefined();
      expect(destination?.name).toBe('Test Destination Safari');
    });

    it('should update a destination', async () => {
      const destination = await prisma.destination.update({
        where: { id: destinationId },
        data: { price: new Prisma.Decimal('1500.00') },
      });

      expect(destination.price.toString()).toBe('1500');
    });

    it('should list destinations by category', async () => {
      const destinations = await prisma.destination.findMany({
        where: { category: 'Wildlife Safari' },
      });

      expect(destinations.length).toBeGreaterThan(0);
    });
  });

  describe('Booking Model', () => {
    let bookingId: number;
    let destinationId: number;

    beforeAll(async () => {
      // Create a destination for booking tests
      const destination = await prisma.destination.create({
        data: {
          name: 'Test Destination for Booking',
          category: 'Adventure',
          country: 'Uganda',
          price: new Prisma.Decimal('800.00'),
          rating: 5,
          duration: '2 Days',
          groupSize: 4,
          description: 'Test destination for booking',
          image: '/test-booking.jpg',
        },
      });
      destinationId = destination.id;
    });

    it('should create a booking', async () => {
      const booking = await prisma.booking.create({
        data: {
          firstName: 'Test',
          lastName: 'Traveler',
          email: 'test-traveler@example.com',
          phone: '+256700000000',
          destinationId,
          numberOfTravelers: 2,
          travelDateFrom: new Date('2025-12-01'),
          travelDateTo: new Date('2025-12-03'),
          pricePerPerson: new Prisma.Decimal('800.00'),
          totalPrice: new Prisma.Decimal('1600.00'),
        },
      });

      bookingId = booking.id;
      expect(booking).toBeDefined();
      expect(booking.email).toBe('test-traveler@example.com');
      expect(booking.status).toBe('PENDING');
      expect(booking.paymentStatus).toBe('PENDING');
    });

    it('should read a booking with destination', async () => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { destination: true },
      });

      expect(booking).toBeDefined();
      expect(booking?.destination).toBeDefined();
      expect(booking?.destination.name).toBe('Test Destination for Booking');
    });

    it('should update booking status', async () => {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      expect(booking.status).toBe('CONFIRMED');
      expect(booking.paymentStatus).toBe('PAID');
    });

    it('should list bookings by email', async () => {
      const bookings = await prisma.booking.findMany({
        where: { email: 'test-traveler@example.com' },
      });

      expect(bookings.length).toBeGreaterThan(0);
    });

    it('should find booking by confirmation number', async () => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId },
      });

      expect(booking).toBeDefined();
      expect(booking?.confirmationNumber).toBeTruthy();

      const foundBooking = await prisma.booking.findUnique({
        where: { confirmationNumber: booking!.confirmationNumber },
      });

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.id).toBe(bookingId);
    });
  });

  describe('ContactInquiry Model', () => {
    let inquiryId: number;

    it('should create a contact inquiry', async () => {
      const inquiry = await prisma.contactInquiry.create({
        data: {
          name: 'Test Contact',
          email: 'test-contact@example.com',
          subject: 'Test Subject',
          message: 'Test message content',
        },
      });

      inquiryId = inquiry.id;
      expect(inquiry).toBeDefined();
      expect(inquiry.status).toBe('NEW');
    });

    it('should read a contact inquiry', async () => {
      const inquiry = await prisma.contactInquiry.findUnique({
        where: { id: inquiryId },
      });

      expect(inquiry).toBeDefined();
      expect(inquiry?.email).toBe('test-contact@example.com');
    });

    it('should update inquiry status', async () => {
      const inquiry = await prisma.contactInquiry.update({
        where: { id: inquiryId },
        data: {
          status: 'RESPONDED',
          responseNotes: 'Test response',
        },
      });

      expect(inquiry.status).toBe('RESPONDED');
      expect(inquiry.responseNotes).toBe('Test response');
    });
  });

  describe('NewsletterSubscription Model', () => {
    const testEmail = 'test-newsletter@example.com';

    it('should create a newsletter subscription', async () => {
      const subscription = await prisma.newsletterSubscription.create({
        data: {
          email: testEmail,
        },
      });

      expect(subscription).toBeDefined();
      expect(subscription.email).toBe(testEmail);
      expect(subscription.status).toBe('ACTIVE');
    });

    it('should read a subscription', async () => {
      const subscription = await prisma.newsletterSubscription.findUnique({
        where: { email: testEmail },
      });

      expect(subscription).toBeDefined();
      expect(subscription?.status).toBe('ACTIVE');
    });

    it('should update subscription status', async () => {
      const subscription = await prisma.newsletterSubscription.update({
        where: { email: testEmail },
        data: {
          status: 'UNSUBSCRIBED',
          unsubscribedAt: new Date(),
        },
      });

      expect(subscription.status).toBe('UNSUBSCRIBED');
      expect(subscription.unsubscribedAt).toBeDefined();
    });
  });

  describe('UserFavorite Model (Relationships)', () => {
    let userId: string;
    let destinationId: number;

    beforeAll(async () => {
      // Create user and destination for favorites test
      const user = await prisma.user.create({
        data: {
          id: 'test-user-favorite',
          email: 'test-favorite@example.com',
          firstName: 'Favorite',
          lastName: 'Tester',
        },
      });
      userId = user.id;

      const destination = await prisma.destination.create({
        data: {
          name: 'Test Destination Favorite',
          category: 'Cultural',
          country: 'Uganda',
          price: new Prisma.Decimal('500.00'),
          rating: 5,
          duration: '1 Day',
          groupSize: 10,
          description: 'Test favorite destination',
          image: '/test-favorite.jpg',
        },
      });
      destinationId = destination.id;
    });

    it('should create a user favorite', async () => {
      const favorite = await prisma.userFavorite.create({
        data: {
          userId,
          destinationId,
        },
      });

      expect(favorite).toBeDefined();
      expect(favorite.userId).toBe(userId);
      expect(favorite.destinationId).toBe(destinationId);
    });

    it('should read user favorites with destination data', async () => {
      const favorites = await prisma.userFavorite.findMany({
        where: { userId },
        include: { destination: true },
      });

      expect(favorites.length).toBeGreaterThan(0);
      expect(favorites[0].destination).toBeDefined();
      expect(favorites[0].destination.name).toBe('Test Destination Favorite');
    });

    it('should prevent duplicate favorites', async () => {
      await expect(
        prisma.userFavorite.create({
          data: {
            userId,
            destinationId,
          },
        })
      ).rejects.toThrow();
    });

    it('should delete a user favorite', async () => {
      const result = await prisma.userFavorite.deleteMany({
        where: {
          userId,
          destinationId,
        },
      });

      expect(result.count).toBe(1);

      const favorites = await prisma.userFavorite.findMany({
        where: { userId, destinationId },
      });

      expect(favorites.length).toBe(0);
    });

    it('should cascade delete favorites when user is deleted', async () => {
      // Create a new favorite
      await prisma.userFavorite.create({
        data: {
          userId,
          destinationId,
        },
      });

      // Delete the user (should cascade to favorites)
      await prisma.user.delete({
        where: { id: userId },
      });

      // Check that favorites were deleted
      const favorites = await prisma.userFavorite.findMany({
        where: { userId },
      });

      expect(favorites.length).toBe(0);
    });
  });

  describe('Complex Queries', () => {
    it('should perform aggregation queries', async () => {
      const stats = await prisma.destination.aggregate({
        _count: { id: true },
        _avg: { price: true },
        _max: { price: true },
        _min: { price: true },
      });

      expect(stats._count.id).toBeGreaterThan(0);
      expect(stats._avg.price).toBeDefined();
    });

    it('should perform groupBy queries', async () => {
      const groupedDestinations = await prisma.destination.groupBy({
        by: ['category'],
        _count: { id: true },
      });

      expect(groupedDestinations.length).toBeGreaterThan(0);
      expect(groupedDestinations[0]).toHaveProperty('category');
      expect(groupedDestinations[0]).toHaveProperty('_count');
    });

    it('should handle transactions', async () => {
      const result = await prisma.$transaction(async (tx) => {
        const destination = await tx.destination.create({
          data: {
            name: 'Test Transaction Destination',
            category: 'Test',
            country: 'Uganda',
            price: new Prisma.Decimal('1000.00'),
            rating: 5,
            duration: '1 Day',
            groupSize: 5,
            description: 'Test transaction',
            image: '/test-tx.jpg',
          },
        });

        const booking = await tx.booking.create({
          data: {
            firstName: 'Transaction',
            lastName: 'Test',
            email: 'test-transaction@example.com',
            phone: '+256700000000',
            destinationId: destination.id,
            numberOfTravelers: 1,
            travelDateFrom: new Date('2025-12-01'),
            travelDateTo: new Date('2025-12-02'),
            pricePerPerson: destination.price,
            totalPrice: destination.price,
          },
        });

        return { destination, booking };
      });

      expect(result.destination).toBeDefined();
      expect(result.booking).toBeDefined();
      expect(result.booking.destinationId).toBe(result.destination.id);
    });
  });
});
