using CSCore.CoreAudioAPI;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace VolumeRocker
{
    public class VolumeRockerHub : Hub
    {
        private const string Code = "int1234";
        private readonly AudioEndpointVolume _playbackDevice;

        public VolumeRockerHub(AudioEndpointVolume playbackDevice)
        {
            _playbackDevice = playbackDevice;
        }

        public async override Task OnConnectedAsync()
        {
            var context = Context.GetHttpContext();
            var queryCode = context.Request.Query["code"][0];
            if(queryCode != Code)
            {
                await Clients.Caller.SendAsync("disconnected");
                Context.Abort();
            }

            await Clients.All.SendAsync("VolumeSet", _playbackDevice.GetMasterVolumeLevelScalar() * 100);
            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Clients.Caller.SendAsync("disconnected");
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SetVolume(int value)
        {
            Console.WriteLine(value);
            _playbackDevice.SetMasterVolumeLevelScalar(value / 100f, Guid.Empty);
            await Clients.All.SendAsync("VolumeSet", value);
        }
    }
}
