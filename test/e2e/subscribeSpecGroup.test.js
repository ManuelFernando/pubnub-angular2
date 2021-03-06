describe('#subscribe_channelGroups', function () {

	var pubnub2 = new window.PubNubAngular();

	pubnub2.init(config.demo);

	var channelGroup = getRandomChannelGroup();
	var channels = [];
	var stringMessage = 'hey';
	var listener = null;
	var error = false;

	for (var x = 0; x < 3; x++) {
		channels.push(getRandomChannel());
	}

	before(function (done) {
		pubnub2.channelGroups.addChannels(
			{
				channels: channels,
				channelGroup: channelGroup
			},
			function(status) {
				error = status.error;
				done();
			}
		);
	});

	afterEach(function () {
		if (listener) {
			pubnub2.removeListener(listener);
		}
	});

	after(function () {
		pubnub2.channelGroups.deleteGroup(
			{channelGroup: channelGroup},
			function(status) {
			}
		);
	});

	this.timeout(20000);

	describe('Using trigger events', function () {
		it('It is able to listen using trigger events', function (done) {
			if(error) this.skip();

			pubnub2.broadcastOn.message(channelGroup, function (m) {

				expect(m).to.not.equal(null);
				expect(m.subscription).to.be.equal(channelGroup);
				expect(m.message).to.be.equal(stringMessage);
				done();
			});

			pubnub2.subscribe({channelGroups: [channelGroup], triggerEvents: true});

			pubnub2.publish({channel: channels[0], message: stringMessage});
		});

		it('It is able to listen from a channel associated to the channel group', function (done) {
			if(error) this.skip();

			pubnub2.broadcastOn.message(channels[1], function (m) {

				expect(m).to.not.equal(null);
				expect(m.channel).to.be.equal(channels[1]);
				expect(m.message).to.be.equal(stringMessage);
				done();
			});

			pubnub2.publish({channel: channels[1], message: stringMessage});
		});
	});

	describe('Listening from a channel group', function () {
		it('It is able to listen over a channel group', function (done) {
			if(error) this.skip();

			listener = {
				message: function (m) {
					expect(m.message).to.be.equal(stringMessage);
					done();
				}
			};

			pubnub2.addListener(listener);

			pubnub2.subscribe({channelGroups: [channelGroup]});

			pubnub2.publish({channel: channels[0], message: stringMessage});
		});
	});
});